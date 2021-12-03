import argparse
import datetime
from datetime import datetime
from pathlib import Path

from tqdm import tqdm

from AccessSql import SQL
from Env import Env as e
from Logger import Logger
from ProcessInputs import ProcessInputs

parser = argparse.ArgumentParser(description="Add item to Library")
parser.add_argument('--option',
                    choices=['delete', 'add'],
                    default='add',
                    help="Choose what to do to sql")
parser.add_argument('--input', type=lambda x: Path(x).absolute(),
                    help="Path to take in Files to be added to library",
                    default="./1. input")
parser.add_argument('--output', type=lambda x: Path(x).absolute(),
                    help="Path to push out Files to be added to library",
                    default="../backend/public/comic")
parser.add_argument('--prod', action="store_true", help="If enable, upload to SQL DB")
args = parser.parse_args()

log_path = Path(f'./log/debug-{datetime.today().strftime("%Y-%m-%d-%H-%M-%S")}.log')
log = Logger(log_path).get_logger()


mysql = SQL(e.USER, e.PWD, e.HOST, e.DB)


def main():
    p = ProcessInputs(log, args.output)
    lib_df, chapt_df = p.run(args.input)
    # TODO: Update SQL STRING CoverPath and Page Paths the ITEMID properly
    update_sql(lib_df, chapt_df)


def update_sql(lib_df, chapt_df):
    for i, entry in tqdm(lib_df.iterrows(), total=lib_df.shape[0], desc="Updating Database"):
        update_lib(entry)
        update_chpt_ep(chapt_df.loc[chapt_df['ItemId'] == entry['ItemId']])


def update_chpt_ep(chapt_df, insert_type="img"):
    for row in chapt_df.itertuples():
        date_now = datetime.today().strftime('%Y-%m-%d %H:%M:%S')
        if insert_type == 'img':
            q_str = f"""
            INSERT INTO Chapters(ChptId, ChapterNo, TotalPages, DateCreated, ItemId)
            VALUES
            ({row.ChptId}, {row.Chapter}, {len(row.Pages)}, '{date_now}', {row.ItemId})
            """
            if args.prod:
                mysql.query(q_str)
                mysql.set_update()
            else:
                log.info(q_str)

            update_pages(row.Pages, row.ChptId, row.ItemId)


def update_pages(page_list, chpt_id, item_id):
    max_page_id = mysql.query("SELECT MAX(PageId) FROM Pages")[0][0]

    page_id = 1 if max_page_id is None else max_page_id + 1

    for _, page, _ in page_list:
        q_str = f"""
        INSERT INTO Pages(PageId, Path, ChptId)
        VALUES
        ({page_id}, '{page.format(item_id=item_id)}', {chpt_id})
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
    '{entry['CoverPath'].format(item_id=entry['ItemId'])}', {entry['TotalEntries']})
    """ if not entry['ItemExist'] else f"""
    UPDATE Library_Items
    SET DateCreated='{entry['DateCreated']}', TotalEntries={entry['TotalEntries']}
    WHERE ItemId={entry['ItemId']}
    """
    if args.prod:
        mysql.query(q_str)
        mysql.set_update()
    else:
        log.info(q_str)


if __name__ == '__main__':
    main()
