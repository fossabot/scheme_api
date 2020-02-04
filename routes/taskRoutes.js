const task = require("../controllers/tasks/taskController");
const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.get("/get", (req, res) => {
  task.get(req, res);
});
router.post("/create", (req, res) => {
  task.create(req, res);
});
router.delete("/remove", (req, res) => {
  task.remove(req, res);
});
router.post("/edit", (req, res) => {
  task.edit(req, res);
});

module.exports = router;
