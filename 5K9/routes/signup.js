const express = require("express");
const router = express.Router();
const path = require("path");
const sendEmail = require("../controllers/send-signup-email");

// Get signup site page
router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/signup.html"));
});

// Handle signup form submission
router.post("/confirmation", async function (req, res) {
  // Send email
  await sendEmail(req.body);
  // Send confirmation page route
  res.status(200).send({
    confirmation_route: "/signup-confirmation.html",
  });
});

module.exports = router;
