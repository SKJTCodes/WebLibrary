const dbconnection = require("./mysqlconn");

const getQuery = async function (qStr) {
  try {
    rows = await dbconnection.query(qStr);
    return Object.values(JSON.parse(JSON.stringify(rows)));
  } catch (err) {
    throw err;
  }
};

module.exports.getRows = async function (itemId, table, colName = "ComicId") {
  try {
    const data = await getQuery(
      `SELECT * FROM ${table} WHERE ${colName}=${itemId}`
    );
    return data;
  } catch (err) {
    throw err;
  }
};

module.exports.getComicInfoAll = async function (itemId, table) {
  try {
    const item = await getQuery(
      `SELECT * FROM Library_Items WHERE ItemId=${itemId}`
    );

    const ep_chpt = await getQuery(
      `SELECT * FROM ${table} WHERE ItemId=${itemId}`
    );

    let data_list = null;
    if (table === "Chapters") {
      data_list = await Promise.all(
        ep_chpt.map(async (c) => {
          const pages = await getQuery(
            `SELECT * FROM Pages WHERE ChptId=${c.ChptId}`
          );
          const pagePaths = pages.map((p) => p.Path);
          return { ...c, PagePaths: pagePaths };
        })
      );
    } else if (table === "Episodes") {
      data_list = ep_chpt;
    }

    return {
      identity: item[0],
      [table.toLowerCase()]: data_list,
      [`total_${table.toLowerCase()}`]: data_list.length,
    };
  } catch (err) {
    throw err;
  }
};

module.exports.getGenre = async function (itemId) {
  try {
    const data = await getQuery(`SELECT * FROM Genres WHERE ItemId=${itemId}`);
    const arrayData = data.map((o) => o.Text);
    return arrayData;
  } catch (err) {
    throw err;
  }
};

module.exports.getPage = async function (
  page,
  table,
  type,
  sort = "DateCreated",
  nPerPage = 20
) {
  try {
    // Get Data Results of each Page
    const offset = nPerPage * (page - 1);
    const query = `
      SELECT *
      FROM ${table}
      WHERE ItemType='${type}'
      ORDER BY ${sort} DESC
      LIMIT ${offset},${nPerPage}
      `;
    const pageData = await getQuery(query);

    // Get total number of rows
    const total = await getQuery(
      `SELECT COUNT(ItemId) FROM ${table} WHERE ItemType='${type}'`
    );
    const totalRows = total[0]["COUNT(ItemId)"];

    // total number of pages
    const totalPages = Math.ceil(totalRows / nPerPage);

    return {
      results: pageData,
      total_results: totalRows,
      total_pages: totalPages,
    };
  } catch (err) {
    throw err;
  }
};

const getPageQuery = function (itemId, chptNum) {
  return `
  SELECT Pages.Path
  FROM Chapters INNER JOIN Pages
  ON Pages.ChptId=Chapters.ChptId
  WHERE Chapters.ItemId=${itemId}
  AND Chapters.ChapterNo=${chptNum}
`;
};

// Get Current/Prev/Next Chapter Pages
module.exports.getCurAdjChptPages = async function (itemId, chptNum) {
  try {
    const cur_data = await getQuery(getPageQuery(itemId, chptNum));

    const item_info = await getQuery(
      `SELECT * FROM Library_Items WHERE ItemId=${itemId}`
    );

    let page_paths = cur_data.map((p) => p.Path);
    // Sort Paths according to page number
    page_paths = page_paths.sort(
      (a, b) =>
        parseInt(
          a.split("/")[a.split("/").length - 1].replace(/[.][a-z]{1,3}/i, "")
        ) -
        parseInt(
          b.split("/")[b.split("/").length - 1].replace(/[.][a-z]{1,3}/i, "")
        )
    );

    // Add Chapter Number to item info
    const item = item_info[0];
    item["ChapterNum"] = parseInt(chptNum);

    const entry = {
      item: item,
      curChapt: page_paths,
    };
    // Get List of Chapters
    const chpt_list = await getQuery(
      `SELECT * FROM Chapters WHERE ItemId=${itemId} ORDER BY ChapterNo`
    );

    if (chpt_list.length === 1) {
      entry["NextChaptNum"] = -1;
      entry["PrevChaptNum"] = -1;
    } else {
      const cur_index = chpt_list.findIndex(
        (x) => x.ChapterNo === parseInt(chptNum)
      );
      entry["PrevChaptNum"] =
        cur_index === 0 ? -1 : chpt_list[cur_index - 1].ChapterNo;
      entry["NextChaptNum"] =
        cur_index === chpt_list.length - 1
          ? -1
          : chpt_list[cur_index + 1].ChapterNo;
    }

    return entry;
  } catch (err) {
    throw err;
  }
};

// Search Table
module.exports.search = async function (searchText) {
  try {
    const searchComic = await getQuery(
      `SELECT * FROM comics WHERE MATCH (Title,Author,Description) AGAINST ('${searchText}' IN BOOLEAN MODE)`
    );
    const searchGenre = await getQuery(`
  SELECT * 
  FROM genres AS g 
  INNER JOIN comics AS c
  WHERE g.ComicId=c.ComicId
  AND MATCH (g.Text)
  AGAINST ('${searchText}' IN BOOLEAN MODE)
  `);
    const data = [...searchComic, ...searchGenre];
    return data;
  } catch (err) {
    throw err;
  }
};
