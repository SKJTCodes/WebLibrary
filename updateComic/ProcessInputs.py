import re
import shutil
from datetime import datetime
from pathlib import Path
import helper as h

import pandas as pd
from tqdm import tqdm

from AccessSql import SQL
from Env import Env as e


class ProcessInputs:
    def __init__(self, log, out_base):
        self.log = log
        self.out = Path(out_base) if isinstance(out_base, str) else out_base
        self.mysql = SQL(e.USER, e.PWD, e.HOST, e.DB)

    def run(self, input_path, item_type="img"):
        input_path = Path(input_path) if isinstance(input_path, str) else input_path

        if item_type == 'img':
            df = self._process_img(input_path)
            df, c_df = self._process_comic_info(df)
            df, c_df = self._remove_existing(df, c_df)
            self._copy_files(c_df)
        else:
            df = pd.DataFrame(columns=['ItemId', 'cpt_ep', 'Title', 'Maker', 'ItemType', 'DateCreated', 'CoverPath',
                                       'TotalEntries'])
            c_df = pd.DataFrame(columns=['ItemId', 'ChptId', 'Chapter', "Pages", 'AlreadyExist'])

        return df, c_df

    def _process_img(self, path, img_ext=None):
        if img_ext is None:
            img_ext = ['.jpg', '.png']

        img_ext = [x if x[0] == "." else f".{x}" for x in img_ext]
        img_pat = [fr".*\{x}" for x in img_ext]
        img_pat = "|".join(img_pat)

        data = []
        total_comics = [x for x in path.iterdir()]
        for comic in tqdm(total_comics, total=len(total_comics), desc="Obtaining Info"):
            if comic.name == '0. Author+Title':
                continue

            if "+" not in str(comic.stem):
                self.log.warning(f"Folder don't have +. {comic.stem}")
                continue

            author, title = str(comic.stem).split("+")
            cover_suffix = None

            chapter_paths = {}
            c_paths = [str(x) for x in comic.iterdir() if x.is_dir()]
            c_paths = [Path(x) for x in h.sort_num_string(c_paths)]

            for index, cpt in enumerate(c_paths):
                float_match = re.search(r"\D*(\d+\.\d+)\D*", cpt.name)  # if is float
                # find number in folder name, if cannot find then use index
                if float_match is None:
                    int_match = re.search(r"\D*(\d+)\D*", cpt.name)  # if is int
                    if int_match is None:
                        chapter = index + 1
                    else:
                        chapter = int(int_match.group(1))
                else:  # if is float
                    chapter = float(float_match.group(1))

                data_img_path = []
                pages = [str(x) for x in cpt.iterdir() if re.match(img_pat, str(x))]
                pages = [Path(x) for x in h.sort_num_string(pages)]
                for i_ind, image in enumerate(pages):
                    page = i_ind + 1
                    data_img_path.append((image, "comic/" + "{item_id}" + f"/{chapter}/{page}{image.suffix}", page))

                    if page == 1:
                        cover_suffix = image.suffix

                chapter_paths.update({chapter: data_img_path})

            title = title.replace("'", "''").lower()
            maker = author.replace("'", "''").lower()

            data.append(dict(ItemId=None, cpt_ep=chapter_paths, Title=title, Maker=maker,
                             ItemType="img", DateCreated=datetime.today().strftime('%Y-%m-%d %H:%M:%S'),
                             CoverPath='comic/{item_id}' + f'/cover{cover_suffix}',
                             TotalEntries=0))

        df = pd.DataFrame(data)
        return df

    def _copy_files(self, c_df, type_paths=None):
        """
        copy input files to output folder in the format it should be for the server public folder
        :param c_df:
        :param type_paths: sub-path used in database, the leading folder in the path. please only insert
                        two elements in the array. e.g. ['video/', 'comic/']
        :return:
        """
        if type_paths is None:
            type_paths = ['video/', 'comic/']

        for row in tqdm(c_df.itertuples(), total=c_df.shape[0], desc="Copying Files to Output"):
            if row.AlreadyExist:
                continue

            for src_path, dst_path, page_num in row.Pages:
                path = dst_path.replace(type_paths[0], "").replace(type_paths[1], "")
                dst = self.out / path.format(item_id=row.ItemId)
                dst.parents[0].mkdir(parents=True, exist_ok=True)

                shutil.copy(src_path, dst)
                if page_num == 1:
                    shutil.copy(src_path, dst.parents[1] / f'cover{src_path.suffix}')

    def _process_comic_info(self, df):
        df['ItemExist'] = False
        df = self._set_id(df)

        # Get Max Chapt Id
        max_chpt_id = self.mysql.query("SELECT MAX(ChptId) FROM Chapters")[0][0]
        new_chapt_id = 1 if max_chpt_id is None else max_chpt_id + 1

        # Process Chapters and generate new df
        c_df = pd.DataFrame(columns=['ItemId', 'ChptId', 'Chapter', 'Pages', 'AlreadyExist'])
        for row in df.itertuples():
            for chapter_num, page_list in row.cpt_ep.items():
                chapter = self.mysql.query(f"SELECT ChptId FROM Chapters "
                                           f"WHERE ItemId={row.ItemId} "
                                           f"AND ChapterNo={chapter_num}")
                if len(chapter) > 0:
                    exist = True
                    chpt_id = chapter[0][0]
                else:
                    exist = False
                    chpt_id = new_chapt_id
                    new_chapt_id += 1

                data = {
                    'ItemId': row.ItemId,
                    'ChptId': chpt_id,
                    'Chapter': chapter_num,
                    'Pages': page_list,
                    'AlreadyExist': exist
                }

                c_df = c_df.append(data, ignore_index=True)
        return df, c_df

    @staticmethod
    def _remove_existing(df, c_df):
        df['Remove'] = False
        c_df = c_df.loc[c_df['AlreadyExist'] == False].copy()

        for row in df.itertuples():
            chapters = c_df.loc[c_df['ItemId'] == row.ItemId]
            if chapters.empty:
                df.loc[row.Index, "Remove"] = True
            else:
                df.loc[row.Index, "TotalEntries"] = row.TotalEntries + chapters.shape[0]
                df.loc[row.Index, "Remove"] = False

        df = df.loc[df['Remove'] == False].copy()
        df.drop(columns=['Remove'], inplace=True)
        return df, c_df

    def _set_id(self, df):
        max_id = self.mysql.query(f"SELECT MAX(ItemId) FROM Library_Items")[0][0]
        new_id = 1 if max_id is None else max_id + 1

        for row in df.itertuples():
            item_id = self.mysql.query(f"SELECT ItemId, TotalEntries "
                                       f"FROM Library_Items "
                                       f"WHERE Title='{row.Title}' "
                                       f"AND Maker='{row.Maker}'")
            if len(item_id) == 0:
                df.loc[row.Index, 'ItemId'] = new_id
                new_id += 1
                continue

            df.loc[row.Index, 'ItemId'] = item_id[0][0]
            df.loc[row.Index, 'TotalEntries'] = item_id[0][1]
            df.loc[row.Index, 'ItemExist'] = True

        return df
