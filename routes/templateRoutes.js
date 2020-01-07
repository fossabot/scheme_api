const router = require("express").Router();
const template = require("../controllers/templates/templateController");
router.post("/update", (req, res) => {
  template.update(req, res);
});
router.get("/all", (req, res) => {
  template.getTemplates(req, res);
});
module.exports = router;
