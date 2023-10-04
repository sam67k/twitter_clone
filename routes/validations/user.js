const {
  user: { validateUsername, validateEmail, validateSignup, validateSignin },
} = require("./schemas");
const ApiError = require("../../utils/apiError");
module.exports = {
  validateUsername: (req, res, next) => {
    const { error } = validateUsername.validate(req.query, {
      errors: { label: "key", wrap: { label: false } },
    });
    if (error) {
      throw new ApiError(404, error.details[0].message);
    } else {
      next();
    }
  },
  validateEmail: (req, res, next) => {
    const { error } = validateEmail.validate(req.query, {
      errors: { label: "key", wrap: { label: false } },
    });
    if (error) {
      throw new ApiError(404, error.details[0].message);
    } else {
      next();
    }
  },
  validateSignup: (req, res, next) => {
    const { error } = validateSignup.validate(req.body, {
      errors: { label: "key", wrap: { label: false } },
    });
    if (error) {
      throw new ApiError(404, error.details[0].message);
    } else {
      next();
    }
  },
  validateSignin: (req, res, next) => {
    const { error } = validateSignin.validate(req.query, {
      errors: { label: "key", wrap: { label: false } },
    });
    if (error) {
      throw new ApiError(404, error.details[0].message);
    } else {
      next();
    }
  },
};
