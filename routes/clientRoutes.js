const express = require("express");
const router = express.Router();
const client = require("./../controllers/clients/clientController");
// const multer = require("multer");
// const mime = require("mime-types");
// const uuid = require("uuid");

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function(req, file, cb) {
//     let ext = mime.extension(file.mimetype);
//     cb(null, `${uuid()}.${ext}`);
//   }
// });

// const upload = multer({ storage });
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
// router.post("/uploadlogo", upload.single("company_image"), (req, res) => {
//   const helpers = require("../helpers");
//   try {
//     if (req.file) {
//       // Upload the file itself and return the path
//       helpers.success(res, { path: require("path").resolve(req.file.path) });
//     } else {
//       helpers.error(res, "Error uploading image, please try again");
//     }
//   } catch (error) {
//     helpers.error(res, error);
//   }
// });
module.exports = router;
