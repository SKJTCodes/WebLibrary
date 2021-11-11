const express = require("express");
const router = express.Router();
const {
  search,
  getGenre,
  getPage,
  getComicInfoAll,
} = require("../services/mysql");
const { deleteFolder } = require("../services/filesystem");
const path = require("path");

/* Update Entry */
router.post("/upd", (req, res) => {
  const keys = Object.keys(req.body);
  let i = 0;
  const data = {};

  const id = parseInt(req.body["id"]);

  while (keys[i]) {
    if (keys[i] == "id");
    else if (Array.isArray(req.body[keys[i]]))
      data[keys[i]] = req.body[keys[i]];
    else if (req.body[keys[i]] === "") data[keys[i]] = "";
    else if (Number.isInteger(req.body[keys[i]]))
      data[keys[i]] = req.body[keys[i]];
    else if (keys[i].toLowerCase().includes("date"))
      data[keys[i]] = new Date(req.body[keys[i]]);
    else data[keys[i]] = req.body[keys[i]].toLowerCase().trim();
    i++;
  }

  updateEntry("COMICS", id, data)
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send(err);
    });
});

/* GET Library data, Page by Page */
router.get("/l", function (req, res) {
  let { page, num, sort } = req.query;
  if (!num) {
    num = 20;
  }

  getPage(parseInt(page), "Library_Items", 'img', sort, parseInt(num)).then((data) => {
    res.json({ ...data, page: parseInt(page) });
  });
});

/* Get Entry Info, including Chapter info from sub table */
router.get("/entry", function (req, res) {
  const { itemId } = req.query;
  getComicInfoAll(itemId, 'Chapters')
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

// Get Search Results
router.get("/search", function(req, res) {
  const {text} = req.query;
  
  search(text).then(data => {
    res.json(data)
  }).catch(err => {
    console.error(err)
    res.status(404).send(err)
  })
})

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
