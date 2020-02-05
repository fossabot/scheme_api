const router = require("express").Router();
const reports = require("../controllers/reports/reportController");

router.get("/metrics", (req, res) => {
  reports.getMetrics(req, res);
});
router.get("/shifts", (req, res) => {
  reports.getShifts(req, res);
});
router.get("/weekly", (req, res) => {
  reports.getWeekly(req, res);
});
router.get("/dashboard", (req, res) => {
  reports.getfilteredReports(req, res);
});
module.exports = router;
