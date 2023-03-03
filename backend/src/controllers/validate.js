const Joi = require('@hapi/joi');
const { schema } = require('../models/Account');

const registerValidate = (data) => {
  const schema = Joi.object({
    profileImage: Joi.binary(),
    name: Joi.string().required().min(3).max(50),
    cpf: Joi.string().required().min(11),
    email: Joi.string().required().min(3).max(50),
    password: Joi.string().required().min(6).max(200),
    tel: Joi.string().required().min(10).max(15),
    cep: Joi.string(),
    address: Joi.string(),
    number: Joi.string(),
    neighborhood: Joi.string(),
    complement: Joi.string().allow(null, ''),
    uf: Joi.string(),
    city: Joi.string(),
    reference: Joi.string().allow(null, ''),
  });

  return schema.validate(data);
};

const updateValidate = (data) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    profileImage: Joi.binary(),
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().required().min(3).max(50),
    tel: Joi.string().required().min(10).max(15),
    cpf: Joi.string().required().min(11),
    cep: Joi.string(),
    address: Joi.string(),
    number: Joi.string(),
    neighborhood: Joi.string(),
    complement: Joi.string().allow(null, ''),
    uf: Joi.string(),
    city: Joi.string(),
    reference: Joi.string().allow(null, ''),
  });

  return schema.validate(data);
};

const updatePasswordValidate = (data) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    password: Joi.string().required(),
    newPassword: Joi.string().required().min(6).max(200),
  });

  return schema.validate(data);
}

const loginValidate = (data) => {
  const schema = Joi.object({
    tel: Joi.string().required().min(14).max(16),
    password: Joi.string().required().min(6).max(200),
  });

  return schema.validate(data);
}

module.exports.registerValidate = registerValidate;
module.exports.loginValidate = loginValidate;
module.exports.updateValidate = updateValidate;
module.exports.updatePasswordValidate = updatePasswordValidate;