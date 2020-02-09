const { google } = require("googleapis");
const app = require("express")();
const { cache } = require("../../helpers");

const REDIRECT_URL = !process.env.NODE_ENV
  ? "http://localhost:7070/"
  : "http://production-schemeapi.now.sh/";

module.exports = {
  gcal: async req => {
    const { id, returnPath } = req.body;
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${REDIRECT_URL}callback/google`
      );

      // generate a url that asks permissions for Blogger and Google Calendar scopes
      const scopes = ["https://www.googleapis.com/auth/calendar"];

      const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: "offline",

        // If you only need one scope you can pass it as a string
        scope: scopes
      });
      cache.set("gcalCache", { id, returnPath });
      return Promise.resolve(url);
    } catch (error) {
      return Promise.reject(error);
    }
  }
};
