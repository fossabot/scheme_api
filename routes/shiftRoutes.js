const shift = require("../controllers/shifts/shiftsController");
const verifyToken = require("../middlewares/verifyToken");
const express = require("express");
const router = express.Router();
router.post("/timesheet", (req, res) => {
  shift.createFromTimesheet(req, res);
});
router.get("/all", (req, res) => {
  shift.getAllShifts(req, res);
});
router.get("/templates", (req, res) => {
  shift.getTemplates(req, res);
});
router.post("/create", (req, res) => {
  shift.createShift(req, res);
});

router.post("/update", (req, res) => {
  shift.updateShift(req, res);
});
router.delete("/delete", (req, res) => {
  shift.deleteShift(req, res);
});

module.exports = router;
