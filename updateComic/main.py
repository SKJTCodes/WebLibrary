import argparse
import datetime
import re
import shutil
from datetime import datetime
from pathlib import Path
from Env import Env as e

from AccessSql import SQL
from Logger import Logger

parser = argparse.ArgumentParser(description="Add item to Library")
parser.add_argument('--input', type=lambda x: Path(x).absolute(),
                    help="Path to take in Files to be added to library",
                    default="./1. input")
parser.add_argument('--output', type=lambda x: Path(x).absolute(),
                    help="Path to push out Files to be added to library",
                    default="./2. output")
parser.add_argument('--prod', action="store_true", help="If enable, upload to SQL DB")
args = parser.parse_args()

log_path = Path(f'./log/debug-{datetime.today().strftime("%Y-%m-%d-%H-%M-%S")}.log')
log = Logger(log_path).get_logger()


mysql = SQL(e.USER, e.PWD, e.HOST, e.DB)


def main():
    data = get_info(args.input, args.output)
    update_sql(data)


def get_info(root_path, out_root, img_ext=None):
    if img_ext is None:
        img_ext = ['.jpg', '.png']

    img_ext = [x if x[0] == "." else f".{x}" for x in img_ext]
    img_pat = [fr".*\{x}" for x in img_ext]
    img_pat = "|".join(img_pat)

    item_id = mysql.query("SELECT MAX(ItemId) FROM Library_Items")[0][0] + 1

    data = []
    for comic in root_path.iterdir():
        author, title = str(comic.stem).split("+")
        cover_suffix = None

        chapter_paths = {}
        for index, cpt in enumerate(comic.iterdir()):
            chapter = index + 1

            data_img_path = []
            pages = [x for x in cpt.iterdir() if re.match(img_pat, str(x))]
            for i_ind, image in enumerate(pages):
                page = i_ind + 1
                dst = out_root / str(item_id) / str(chapter) / f"{page}{image.suffix}"
                data_img_path.append(f"comic/{item_id}/{chapter}/{page}{image.suffix}")

                dst.parents[0].mkdir(parents=True, exist_ok=True)
                shutil.copy(image, dst)
                if page == 1:
                    cover_suffix = image.suffix
                    shutil.copy(image, dst.parents[1] / f'cover{image.suffix}')

            chapter_paths.update({chapter: data_img_path})

        data.append(dict(ItemId=item_id, cpt_ep=chapter_paths, Title=title, Maker=author, ItemType="img",
                         DateCreated=datetime.today().strftime('%Y-%m-%d %H:%M:%S'),
                         CoverPath=f'comic/{item_id}/cover{cover_suffix}',
                         TotalEntries=len(chapter_paths)))

        item_id += 1
    return data


def update_sql(data):
    for entry in data:
        update_lib(entry)
        update_chpt_ep(entry['cpt_ep'], entry['ItemId'])


def update_chpt_ep(data_entry, item_id, insert_type="img"):
    if insert_type == "img":
        chpt_id = mysql.query("SELECT MAX(ChptId) FROM Chapters")[0][0] + 1
    else:
        chpt_id = None

    for num, data_list in data_entry.items():
        if insert_type == 'img':
            q_str = f"""
            INSERT INTO Chapters(ChptId, ChapterNo, TotalPages, DateCreated, ItemId)
            VALUES
            ({chpt_id}, {num}, {len(data_list)}, '{datetime.today().strftime('%Y-%m-%d %H:%M:%S')}', {item_id})
            """
            if args.prod:
                mysql.query(q_str)
                mysql.set_update()
            else:
                log.info(q_str)

            update_pages(data_list, chpt_id)

            chpt_id += 1


def update_pages(page_list, chpt_id):
    page_id = mysql.query("SELECT MAX(PageId) FROM Pages")[0][0] + 1
    for page in page_list:
        q_str = f"""
        INSERT INTO Pages(PageId, Path, ChptId)
        VALUES
        ({page_id}, '{page}', {chpt_id})
        """

        if args.prod:
            mysql.query(q_str)
            mysql.set_update()
        else:
            log.info(q_str)

        page_id += 1


def update_lib(entry):
    q_str = f"""
    INSERT INTO Library_Items(ItemId, Title, Maker, ItemType, DateCreated, CoverPath, TotalEntries)
    VALUES
    ({entry['ItemId']}, '{entry['Title']}', '{entry['Maker']}', '{entry['ItemType']}', '{entry['DateCreated']}', 
    '{entry['CoverPath']}', {entry['TotalEntries']})
    """
    if args.prod:
        mysql.query(q_str)
        mysql.set_update()
    else:
        log.info(q_str)


if __name__ == '__main__':
    main()
