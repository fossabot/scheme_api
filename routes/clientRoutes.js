const express = require("express");
const router = express.Router();
const client = require("./../controllers/clients/clientController");
const multer = require("multer");
// const storage = require("../helpers/db").storageEngineInit();
const upload = multer({ dest: "uploads" });

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
router.post("/uploadlogo", upload.single("company_image"), (req, res) => {
  const helpers = require("../helpers");
  try {
    if (req.file) {
      console.log(req.file);
      helpers.success(res, { path: req.file.path });
    } else {
      helpers.error(res, "Error uploading image, please try again");
    }
  } catch (error) {
    helpers.error(res, error);
  }
});
module.exports = router;
