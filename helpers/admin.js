const jwt = require("jsonwebtoken");
module.exports = {
  sign(obj) {
    const token = jwt.sign({ data: obj }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    return token;
  }
};
