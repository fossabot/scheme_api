let router = require("express").Router();
let notes = require("./../controllers/notes/noteController");

router.post("/create", (req, res) => {
  notes.create(req, res);
});
router.post("/update", (req, res) => {
  notes.update(req, res);
});
router.get("/get", (req, res) => {
  notes.get(req, res);
});
router.delete("/one", (req, res) => {
  notes.remove(req, res);
});
router.delete("/all", (req, res) => {
  notes.removeAll(req, res);
});
module.exports = router;
