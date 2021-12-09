const express = require("express");
const router = express.Router();
const { search, updateLib, deleteAll, getTags } = require("../services/mysql");
const { deleteFolder } = require("../services/filesystem");
const path = require("path");

// Get Search Results
router.get("/search", function (req, res) {
  let { text, page, num } = req.query;

  if (!num) {
    num = 20;
  }
  console.log(page)
  search(text, page, num)
    .then((data) => {
      res.json({...data, page: page});
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send(err);
    });
});

/* Update Entry */
router.post("/upd", (req, res) => {
  const keys = Object.keys(req.body);
  let i = 0;
  const data = {};

  const id = parseInt(req.body["ItemId"]);

  while (keys[i]) {
    // is ItemId
    if (keys[i] == "ItemId");
    else if (Array.isArray(req.body[keys[i]]))
      // is Genre
      data[keys[i]] = req.body[keys[i]];
    // is empty string
    else if (req.body[keys[i]] === "") data[keys[i]] = "";
    // is chapter
    else if (Number.isInteger(req.body[keys[i]]))
      data[keys[i]] = req.body[keys[i]];
    // if is Date
    else if (keys[i].toLowerCase().includes("date"));
    else
      data[keys[i]] = req.body[keys[i]].toLowerCase().trim();
    i++;
  }
  updateLib(id, data)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send(err);
    });
});

const deleteEntry = async (id, type) => {
  try {
    const sqlMsg = await deleteAll(id, type);
    const idPath = path.join(
      publicPath,
      `${type === "c" ? "comic" : "video"}/${id}`
    );
    const msg = await deleteFolder(idPath);
    return { sql: sqlMsg, fileman: msg };
  } catch (err) {
    throw err;
  }
};

/* Delete Entry */
router.delete("/entry", (req, res) => {
  const { itemId, itemType } = req.query;
  deleteEntry(itemId, itemType)
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send(err);
    });
});

/* Get All Tags and the number of entries with said Tags */
router.get("/tags", (req, res) => {
  getTags()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send(err);
    });
});

module.exports = router;
