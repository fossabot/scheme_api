const express = require("express");
const router = express.Router();
const path = require("path");

const { error, cache } = require("../helpers");
const User = require("../models/User");
const { google } = require("googleapis");
router.get("/google", async (req, res) => {
  try {
    let { id, returnPath } = cache.get("gcalCache");
    const REDIRECT_URL = !process.env.NODE_ENV
      ? "http://localhost:7070/"
      : "http://production-schemeapi.now.sh/";
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${REDIRECT_URL}callback/google`
    );

    const { tokens } = await oauth2Client.getToken(req.query.code);

    oauth2Client.setCredentials(tokens);

    await User.findByIdAndUpdate(id, { gcalToken: tokens });
    res.render("callback", { path: returnPath });
  } catch (err) {
    error(res, err);
  }
});

module.exports = router;
