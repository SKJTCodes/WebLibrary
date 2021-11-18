const express = require("express");
const router = express.Router();
const {
  search,
  getGenre,
  getPage,
  getInfoAll,
  getCurAdjChptPages,
} = require("../services/mysql");
const { deleteFolder } = require("../services/filesystem");
const path = require("path");

/* GET Library data, Page by Page */
router.get("/l", function (req, res) {
  let { page, num, sort } = req.query;
  if (!num) {
    num = 20;
  }

  getPage(parseInt(page), "Library_Items", "img", sort, parseInt(num)).then(
    (data) => {
      res.json({ ...data, page: parseInt(page) });
    }
  );
});

/* Get Entry Info, including Chapter info from sub table */
router.get("/entry", function (req, res) {
  const { itemId } = req.query;
  getInfoAll(itemId, "Chapters")
    .then((data) => {
      getGenre(itemId).then((genres) => {
        data["identity"] = { ...data["identity"], Genre: genres };
        res.json(data);
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send(err);
    });
});

const delCm = async (itemId) => {
  const data = await deleteAll(itemId, "COMICS", "COMIC_ITEMS");

  const idPath = path.dirname(data["delEntry"].cover_path);
  const fullIdPath = path.join(publicPath, idPath);
  const msg = await deleteFolder(fullIdPath);

  data["fileDelMsg"] = msg;
  return data;
};

// Delete COMIC entry
router.delete("/entry", function (req, res) {
  const { itemId } = req.query;

  delCm(parseInt(itemId))
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send(err);
    });
});

// Get Current/Next/Prev Chapter Page Paths
router.get("/page", function (req, res) {
  const { itemId, chptNum } = req.query;

  getCurAdjChptPages(itemId, chptNum)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send(err);
    });
});

// Testing
router.get("/test", function (req, res) {
  const { page } = req.query;
  getPage(parseInt(page), "comics")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.send(err));
});

module.exports = router;
