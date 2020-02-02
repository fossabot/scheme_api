const todo = require("../controllers/todos/todoController");
const express = require("express");
const verifyToken = require("./../middlewares/verifyToken");
const router = express.Router();

router.get("/get", (req, res) => {
  todo.get(req, res);
});
router.post("/create", (req, res) => {
  todo.create(req, res);
});
router.delete("/remove", (req, res) => {
  todo.remove(req, res);
});
router.post("/edit", (req, res) => {
  todo.edit(req, res);
});

module.exports = router;
