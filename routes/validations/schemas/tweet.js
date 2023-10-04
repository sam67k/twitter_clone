const Joi = require("joi");
module.exports = {
  validateTweet: Joi.object({
    content: Joi.string().required().label("Content"),
  }),
};
