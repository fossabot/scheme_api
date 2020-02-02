const router = require("express").Router();
const reports = require("../controllers/reports/reportController");

router.get("/metrics", (req, res) => {
  reports.metrics(req, res);
});
router.get("/shifts", (req, res) => {
  reports.shifts(req, res);
});
router.get("/weekly", (req, res) => {
  reports.weekly(req, res);
});
module.exports = router;
