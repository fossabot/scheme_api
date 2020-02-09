const { initGoogleCal } = require("../controllers/services/servicesController");
const express = require("express");
const router = express.Router();

router.post("/googlecal", (req, res) => {
  initGoogleCal(req, res);
});

module.exports = router;
