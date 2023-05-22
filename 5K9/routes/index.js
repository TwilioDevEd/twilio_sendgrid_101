const express = require("express");
const router = express.Router();
const path = require("path");

/* GET site pages (static HTML/no view engine). */
router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

router.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/about.html"));
});

router.get("/resources", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/resources.html"));
});

module.exports = router;
