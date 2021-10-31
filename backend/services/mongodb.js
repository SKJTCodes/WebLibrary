const mongoClient = require("mongodb").MongoClient;

const CONN = async function () {
  try {
    const client = await mongoClient.connect(process.env.MONGO_BASE, {
      useUnifiedTopology: true,
    });
    const db = client.db(process.env.DB_NAME);
    return db;
  } catch (err) {
    throw err;
  }
};

module.exports.getPage = async function (page, table, table2, nPerPage, sort) {
  try {
    const db = await CONN();
    let data = await db
      .collection(table)
      .find({}, { projection: { _id: 0 } })
      .sort({
        [sort === "chapter" ? "num_chapters" : "date_updated"]: -1,
        title: -1,
      })
      .skip(page > 0 ? (page - 1) * nPerPage : 0)
      .limit(nPerPage)
      .toArray();

    const totalDocs = await db.collection(table).countDocuments();

    const totalPages = Math.ceil(totalDocs / nPerPage);

    return { results: data, total_results: totalDocs, total_pages: totalPages };
  } catch (err) {
    throw err;
  }
};

module.exports.getEntry = async function (itemId, table1, table2) {
  try {
    const db = await CONN();
    const secLabel = table2 === "COMIC_ITEMS" ? "chapter_no" : "episode_no";

    const data = await db
      .collection(table1)
      .find({ id: itemId }, { projection: { _id: 0 } })
      .toArray();

    if (data.length === 0) throw `Unable to find Entry, itemId: ${itemId}`;

    const chapters = await db
      .collection(table2)
      .find({ id: itemId }, { projection: { _id: 0 } })
      .sort({ [secLabel]: 1 })
      .toArray();

    if (chapters.length === 0) throw `Unable to find Entry, itemId: ${itemId}`;

    return [data[0], chapters];
  } catch (err) {
    throw err;
  }
};

module.exports.searchEntry = async function (searchText, table) {
  try {
    const db = await CONN();
    const data = await db
      .collection(table)
      .find(
        { $text: { $search: searchText } },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .toArray();
    return data;
  } catch (err) {
    throw err;
  }
};

module.exports.deleteAll = async function (itemId, table1, table2) {
  try {
    const db = await CONN();

    const data = await db.collection(table1).find({ id: itemId }).toArray();

    if (data.length !== 1)
      throw `Only one can be selected but got ${data.length}. ${JSON.stringify(
        data
      )}`;

    const res1 = await db.collection(table1).deleteOne({ id: itemId });
    const res2 = await db.collection(table2).deleteMany({ id: itemId });

    return { [table1]: res1, [table2]: res2, delEntry: data[0] };
  } catch (err) {
    throw err;
  }
};

module.exports.updateEntry = async function (table, id, upd) {
  try {
    const db = await CONN();

    const res = await db.collection(table).updateOne({ id: id }, { $set: upd });
    if (res['modifiedCount'] >= 1) return `Modified ${res['modifiedCount']} entries. id: ${id}`
    else if (res['modifiedCount'] == 0) return `Did not modify any entries. id: ${id}`
    else return `Unknown process occurred when updating Entries. id ${id}`
  } catch (err) {
    throw err;
  }
};
