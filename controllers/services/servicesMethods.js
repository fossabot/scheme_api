const { cache, services } = require("../../helpers");

module.exports = {
  gcal: async req => {
    const { id, returnPath } = req.body;
    try {
      const { oAuth2Client } = services.google();
      // generate a url that asks permissions for Blogger and Google Calendar scopes
      const scopes = ["https://www.googleapis.com/auth/calendar"];

      const url = oAuth2Client.generateAuthUrl({
        access_type: "online",
        scope: scopes
      });
      cache.set("gcalCache", { id, returnPath });
      return Promise.resolve(url);
    } catch (error) {
      return Promise.reject(error);
    }
  }
};
