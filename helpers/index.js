const admin = require("./admin");
const date = require("./date");
const db = require("./db");
const email = require("./email");
const cache = require("./cache");
let responseObj = {
  success: {
    success: true,
    content: ""
  },
  error: {
    error: true,
    content: ""
  }
};

module.exports = {
  error(res, err) {
    console.log(err);

    responseObj.error.content = err.hasOwnProperty("message")
      ? err.message
      : err;

    res.json(responseObj.error).end();
  },
  success(res, success) {
    responseObj.success.content = success;

    res
      .status(200)
      .json(responseObj.success)
      .end();
  },

  admin,
  date,
  db,
  email,
  cache
};
