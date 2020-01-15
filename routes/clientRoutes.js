const express = require("express");
const router = express.Router();
const client = require("./../controllers/clients/clientController");

router.post("/create", (req, res) => {
  client.createClient(req, res);
});
router.get("/all", (req, res) => {
  client.getAllClients(req, res);
});
router.post("/update", (req, res) => {
  client.updateClient(req, res);
});
router.delete("/delete", (req, res) => {
  client.deleteClient(req, res);
});

router.get("/one", (req, res) => {
  client.getOneClient(req, res);
});

module.exports = router;
