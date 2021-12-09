const dbconnection = require("./mysqlconn");
const helper = require("./helper");

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

// GET Library Item and Chapter/Episode List
module.exports.getInfoAll = async function (itemId, table) {
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

// Get Library Page
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
      ORDER BY ${sort} ${sort === "Title" ? "ASC" : "DESC"}
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

module.exports.getCurAdjEpisodes = async function (itemId, epNum) {
  try {
    const ep_list = await getQuery(
      `SELECT * FROM Episodes WHERE ItemId=${itemId} ORDER BY EpisodeNo`
    );

    const item = await getQuery(
      `SELECT * FROM Library_Items WHERE ItemId=${itemId}`
    );

    const curIndex = ep_list.findIndex((x) => x.EpisodeNo === parseInt(epNum));

    if (curIndex === -1)
      return {
        item: item[0],
        curEp: {},
        PrevEpNum: -1,
        NextEpNum: -1,
      };

    const cur_ep = ep_list[curIndex];

    const entry = {
      item: item[0],
      curEp: cur_ep,
    };

    if (ep_list.length === 1) {
      entry["NextEpNum"] = -1;
      entry["PrevEpNum"] = -1;
    } else {
      entry["PrevEpNum"] =
        curIndex === 0 ? -1 : ep_list[curIndex - 1].EpisodeNo;
      entry["NextEpNum"] =
        curIndex === ep_list.length - 1 ? -1 : ep_list[curIndex + 1].EpisodeNo;
    }

    return entry;
  } catch (err) {
    throw err;
  }
};

const getPageQuery = function (itemId, chptNum) {
  return `
  SELECT Pages.Path, Pages.ImgType
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

    let page_paths = cur_data.map((p) => ({ path: p.Path, type: p.ImgType }));
    // Sort Paths according to page number
    page_paths = page_paths.sort(
      (a, b) =>
        parseInt(
          a.path
            .split("/")
            [a.path.split("/").length - 1].replace(/[.][a-z]{1,3}/i, "")
        ) -
        parseInt(
          b.path
            .split("/")
            [b.path.split("/").length - 1].replace(/[.][a-z]{1,3}/i, "")
        )
    );

    // Add Chapter Number to item info
    const item = item_info[0];
    item["ChapterNum"] = parseFloat(chptNum);

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
        (x) => parseFloat(x.ChapterNo) === parseFloat(chptNum)
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
module.exports.search = async function (searchText, page, nPerPage = 20) {
  try {
    console.log(page)
    const offset = nPerPage * (page - 1);

    const query = `
    SELECT l.ItemId, l.Title, l.ItemType, l.CoverPath
    FROM Library_Items AS l
    INNER JOIN Genres AS g
    WHERE l.ItemId=g.ItemId
    AND (
      MATCH(l.Title,l.Maker,l.Description) 
      AGAINST ('"${searchText}"' IN BOOLEAN MODE)
      OR MATCH(g.Text)
      AGAINST ('"${searchText}"' IN BOOLEAN MODE)
    )
    GROUP BY l.ItemId
    ORDER BY l.ItemId DESC `;

    const searchLibItems = await getQuery(
      query + `LIMIT ${offset},${nPerPage}`
    );

    const total = await getQuery(`SELECT COUNT(*) FROM (` + query + ") as t");

    const TotalPage = Math.ceil(total[0]["COUNT(*)"] / nPerPage);

    const results = {
      img: helper.getDistinctObjArr(
        searchLibItems.filter((item) => item.ItemType === "img"),
        "ItemId"
      ),
      vid: searchLibItems.filter((item) => item.ItemType === "vid"),
      total_pages: TotalPage ? TotalPage : 1,
    };

    return results;
  } catch (err) {
    throw err;
  }
};

// Add Genre Table entry
const addGenre = async function (itemId, genreList) {
  try {
    const maxId = await getQuery(`SELECT MAX(GenreId) FROM Genres`);
    const newId = maxId[0]["MAX(GenreId)"] + 1;
    let addStr = "INSERT INTO Genres(GenreId,Text,ItemId) VALUES ";
    const valueArray = new Array();

    for (let i = 0; i < genreList.length; i++) {
      valueArray.push(`(${newId + i},'${genreList[i]}',${itemId})`);
    }
    const value = valueArray.join(",");
    addStr = addStr + value + ";";
    await getQuery(addStr);
    return `Successfully added new entry to Genres`;
  } catch (err) {
    throw err;
  }
};

// Remove Genre Table entry
const deleteGenre = async function (itemId, genreList) {
  try {
    const genreStr = "'" + genreList.join("','") + "'";
    const query = `
      DELETE FROM Genres 
      WHERE ItemId=${itemId}
      AND Text IN (${genreStr})
    `;
    await getQuery(query);
    return `Successfully deleted Genres entry for ItemId:${itemId}`;
  } catch (err) {
    throw err;
  }
};

// Check which genre to delete and which to keep or add
const checkGenre = async function (itemId, genreList) {
  const itemGenres = await getQuery(
    `SELECT Text FROM Genres WHERE ItemId=${itemId}`
  );
  const genres = itemGenres.map((i) => i.Text);

  if (genreList.length === 0) return { delete: genres };

  if (itemGenres.length === 0) return { delete: [], add: genreList };
  else {
    // those that are not in Table
    const toAdd = genreList.filter((x) => !genres.includes(x));
    // those from the table that are not in new Genre list
    const toRemove = genres.filter((x) => !genreList.includes(x));
    return { delete: toRemove, add: toAdd };
  }
};

// Update Library_Items Table
module.exports.updateLib = async function (itemId, update_vals) {
  try {
    // create the set string for update query
    let setStr = [];
    for (const [key, value] of Object.entries(update_vals)) {
      if (key === "Genre") {
        const genreStatus = await checkGenre(itemId, value);
        if (genreStatus["delete"].length > 0)
          await deleteGenre(itemId, genreStatus["delete"]);
        if (genreStatus["add"].length > 0)
          await addGenre(itemId, genreStatus["add"]);
      } else if (typeof value === "number") setStr.push(`${key}=${value}`);
      else if (typeof value === "string") setStr.push(`${key}='${value}'`);
    }
    setStr = setStr.join(", ");
    const query = `
      UPDATE Library_Items
      SET ${setStr}
      WHERE ItemId=${itemId}
    `;
    await getQuery(query);
    return `Sucessfully Updated ${itemId}`;
  } catch (err) {
    throw err;
  }
};

// Delete All items associated with ItemId
module.exports.deleteAll = async function (itemId, itemType) {
  try {
    // Delete Pages if Chapter
    if (itemType === "c") {
      // Get Chapter that will be deleted
      const chaptInfo = await getQuery(
        `SELECT ChptId FROM Chapters WHERE itemId=${itemId}`
      );
      const delChapt = chaptInfo.map((item) => item.ChptId);
      await getQuery(
        `DELETE FROM Pages WHERE ChptId IN (${delChapt.join(",")})`
      );
    }

    // Delete Episode/Chapter
    await getQuery(`DELETE FROM ${
      itemType === "c" ? "Chapters" : "Episodes"
    } WHERE ItemId=${itemId}
  `);
    // Delete Genre
    await getQuery(`DELETE FROM Genres WHERE ItemId=${itemId}`);
    // Delete LibItem
    await getQuery(`DELETE FROM Library_Items WHERE ItemId=${itemId}`);

    return `Successfully deleted all ID:${itemId}`;
  } catch (err) {
    throw err;
  }
};

// Get All tags and number of entries using the tag
module.exports.getTags = async function () {
  try {
    const data = await getQuery(
      `SELECT Text, COUNT(*) as Num FROM Genres GROUP BY Text ORDER BY Text;`
    );
    return data;
  } catch (err) {
    throw err;
  }
};
