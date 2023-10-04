const ApiError = require("../utils/apiError");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { Users } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const token = req.header("Authorization");

    if (!token) {
      throw new ApiError(400, "Authorization Header is required");
    }

    let decodeUserId;

    jwt.verify(token, config.get("jwt.secret"), (err, decoded) => {
      if (err) {
        throw new ApiError(401, "Authentication Failed.");
      }
      decodeUserId = decoded.id;
    });

    const user = await Users.findOne({
      where: {
        id: decodeUserId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User doesn't exist");
    }

    if (Number(userId) !== user.id) {
      throw new ApiError(400, "Invalid User");
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
