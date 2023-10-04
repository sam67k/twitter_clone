const Joi = require("joi");
module.exports = {
  validateUsername: Joi.object({
    username: Joi.string().required().label("Username"),
  }),
  validateEmail: Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
  }),
  validateSignup: Joi.object({
    fullname: Joi.string().required().label("Fullname"),
    username: Joi.string().required().label("Username"),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    password: Joi.string().required().label("Password"),
  }),
  validateSignin: Joi.object({
    usernameOrEmail: Joi.string().required().label("Username or Email"),
    password: Joi.string().required().label("Password"),
  }),
};
