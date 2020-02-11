const express = require("express");
const router = express.Router();
const path = require("path");

const { error, cache, services } = require("../helpers");
const User = require("../models/User");

router.get("/google", async (req, res) => {
  try {
    let { id, returnPath } = cache.get("gcalCache");
    const { oAuth2Client } = services.google(id);
    const { tokens } = await oAuth2Client.getToken(req.query.code);

    oAuth2Client.setCredentials(tokens);

    await User.findByIdAndUpdate(id, { gcalToken: tokens });
    res.render("callback", { path: returnPath });
  } catch (err) {
    error(res, err);
  }
});

module.exports = router;
