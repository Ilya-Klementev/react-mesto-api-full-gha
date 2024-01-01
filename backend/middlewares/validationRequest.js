const { Joi } = require('celebrate');
const { regEx } = require('../utils/regEx');

const validationRequestSignin = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const validationRequestSignup = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regEx),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),

};

module.exports = { validationRequestSignin, validationRequestSignup };
