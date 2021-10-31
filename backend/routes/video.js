const express = require("express");
const router = express.Router();
const { getPage } = require("../services/mongodb");

/* GET home page. */
router.get("/l", function (req, res) {
  let { page, num } = req.query;
  if (!num) {
    num = 20;
  }

  getPage(page, "v_iden", parseInt(num))
    .then((data) => {
      res.json({ ...data, page: parseInt(page) });
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send(err);
    });
});

module.exports = router;
