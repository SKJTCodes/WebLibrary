const express = require("express");
const router = express.Router();

const multer = require("multer"),
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/tmp/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
const upload = multer({ storage: storage });

router.post("/u", upload.any(), (req, res) => {
  const { type } = req.query;
  const files = req.files;

  // if uploading Comic
  if (type == "c") {
    const { title, author, chapter, genre } = req.body;
    const genreList = genre.split(",");
    const chpt = parseInt(chapter);
    console.log(genreList);
    console.log(files);
    // TODO: Process Files when received
  }
  // If uploading Video
  else {
    console.log("Upload Video");
  }
  res.status(200).send("OK");
});

module.exports = router;
