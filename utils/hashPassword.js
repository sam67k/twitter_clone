const bcrypt = require("bcrypt");
const ApiError = require("./apiError");

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function checkPasswordValidity(password, hashedPassword) {
  if (!bcrypt.compareSync(password, hashedPassword)) {
    throw new ApiError(401, "Invalid password.");
  }
}

module.exports = { hashPassword, checkPasswordValidity };
