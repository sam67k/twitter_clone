const jwt = require("jsonwebtoken");
const config = require("../config");

function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, config.get("jwt.secret"), {
    algorithm: "HS256",
    allowInsecureKeySizes: true,
    expiresIn: 86400,
  });
}

module.exports = { generateAccessToken };
