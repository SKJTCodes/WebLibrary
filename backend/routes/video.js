const express = require("express");
const router = express.Router();
const { getPage, getGenre, getComicInfoAll } = require("../services/mysql");

router.get("/l", function (req, res) {
  let { page, num, sort } = req.query;
  if (!num) {
    num = 20;
  }
  if (!sort) {
    sort = "DateCreated";
  }
  getPage(parseInt(page), "Library_Items", "vid", sort, parseInt(num)).then(
    (data) => {
      res.json({ ...data, page: parseInt(page) });
    }
  );
});

/* Get Entry Info, including Episodes info from sub table */
router.get("/entry", function (req, res) {
  const { itemId } = req.query;
  getComicInfoAll(itemId, "Episodes")
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

module.exports = router;
