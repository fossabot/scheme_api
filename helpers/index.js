const admin = require("./admin");
const date = require("./date");
const db = require("./db");
const email = require("./email");
const cache = require("./cache");
const services = require("./services");
const path = require("path");
const fs = require("fs");
const lang = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "stubs/lang.json"))
);

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
  cache,
  services,
  lang
};
