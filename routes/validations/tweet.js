const {
  tweet: { validateTweet },
} = require("./schemas");
const ApiError = require("../../utils/apiError");
module.exports = {
  validateTweet: (req, res, next) => {
    const { error } = validateTweet.validate(req.body, {
      errors: { label: "key", wrap: { label: false } },
    });
    if (error) {
      throw new ApiError(404, error.details[0].message);
    } else {
      next();
    }
  },
};
