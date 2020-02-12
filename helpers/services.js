const { google } = require("googleapis");
const User = require("../models/User");
const REDIRECT_URL = !process.env.NODE_ENV
  ? "http://localhost:7070/"
  : "http://production-schemeapi.now.sh/";

module.exports = {
  google: async id => {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${REDIRECT_URL}callback/google`
    );

    if (id) {
      oAuth2Client.on("tokens", async tokens => {
        if (tokens.refresh_token) {
          // store the refresh_token in my database!
          await User.findByIdAndUpdate(id, { gcalToken: tokens.refresh_token });
        }
      });
    }
    return { oAuth2Client, google };
  }
};
