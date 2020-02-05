const express = require("express");
const router = express.Router();
const client = require("./../controllers/clients/clientController");
const verifyToken = require("../middlewares/verifyToken");
router.post("/create", (req, res) => {
  client.create(req, res);
});
router.get("/all", (req, res) => {
  client.get(req, res);
});
router.post("/update", verifyToken, (req, res) => {
  client.update(req, res);
});
router.delete("/delete", (req, res) => {
  client.delete(req, res);
});

router.get("/get", (req, res) => {
  client.getOne(req, res);
});

module.exports = router;
