const express = require("express");
const router = express.Router();
const { search, updateLib } = require("../services/mysql");
const path = require("path");

// Get Search Results
router.get("/search", function (req, res) {
  const { text } = req.query;

  search(text)
    .then((data) => {
      res.json(data);
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
    // is Genre
    else if (Array.isArray(req.body[keys[i]]))
      data[keys[i]] = req.body[keys[i]];
    // is empty string
    else if (req.body[keys[i]] === "") data[keys[i]] = "";
    // is chapter
    else if (Number.isInteger(req.body[keys[i]]))
      data[keys[i]] = req.body[keys[i]];
    // if is Date
    else if (keys[i].toLowerCase().includes("date"));
      // data[keys[i]] = new Date(req.body[keys[i]]);
    else data[keys[i]] = req.body[keys[i]].toLowerCase().trim();
    i++;
  }
  updateLib(id, data).then(data=> {
    res.send(data)
  }).catch(err => {
    console.error(err);
    res.status(404).send(err);
  })
  
});

module.exports = router;
