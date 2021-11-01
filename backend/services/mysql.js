const mysql = require("mysql");
const util = require("util");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
});
const q = util.promisify(conn.query).bind(conn);

const getQuery = async function (qStr) {
  try {
    const rows = await q(qStr);
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

module.exports.getComicInfoAll = async function (itemId) {
  try {
    const comic = await getQuery(
      `SELECT * FROM comics WHERE ComicId=${itemId}`
    );
    const chapters = await getQuery(
      `SELECT * FROM comic_items WHERE ComicId=${itemId}`
    );
    const chpt_list = await Promise.all(
      chapters.map(async (c) => {
        const pages = await getQuery(
          `SELECT * FROM pages WHERE ItemId=${c.ItemId}`
        );
        const pagePaths = pages.map((p) => p.Path);
        return { ...c, PagePaths: pagePaths };
      })
    );

    return {
      identity: comic[0],
      chapters: chpt_list,
      total_chapters: chpt_list.length,
    };
  } catch (err) {
    throw err;
  }
};

module.exports.getGenre = async function (itemId) {
  try {
    const data = await getQuery(`SELECT * FROM genres WHERE ComicId=${itemId}`);
    const arrayData = data.map((o) => o.Text);
    return arrayData;
  } catch (err) {
    throw err;
  }
};

module.exports.getPage = async function (
  page,
  table,
  sort = "DateCreated",
  nPerPage = 20
) {
  try {
    // Get Data Results of each Page
    const offset = nPerPage * (page - 1);
    const query = `
      SELECT *
      FROM ${table}
      ORDER BY ${sort} DESC
      LIMIT ${offset},${nPerPage}
      `;
    const pageData = await getQuery(query);

    // Get total number of rows
    const total = await getQuery(`SELECT COUNT(ComicId) FROM ${table}`);
    const totalRows = total[0]["COUNT(ComicId)"];

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

module.exports.search = async function(searchText){
try {
  const searchComic = await getQuery(`SELECT * FROM comics WHERE MATCH (Title,Author,Description) AGAINST ('${searchText}' IN BOOLEAN MODE)`)
  const searchGenre = await getQuery(`
  SELECT * 
  FROM genres AS g 
  INNER JOIN comics AS c
  WHERE g.ComicId=c.ComicId
  AND MATCH (g.Text)
  AGAINST ('${searchText}' IN BOOLEAN MODE)
  `)
  const data = [...searchComic, ...searchGenre]
  return data
}catch (err) {
  throw err;
}
}
