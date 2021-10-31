const mysql = require("mysql");
const util = require("util");

const conn = mysql.createConnection({
  host: "localhost",
  user: "pi",
  password: "28011994",
  database: "web_lib",
  // database: process.env.DB_NAME
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

module.exports.getRows = async function (itemId, table) {
  try {
    const data = await getQuery(
      `SELECT * FROM ${table} WHERE ComicId=${itemId}`
    );
    return data;
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
    console.log(offset);
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
