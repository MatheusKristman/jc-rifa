const Joi = require('@hapi/joi');

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
    complement: Joi.string(),
    uf: Joi.string(),
    city: Joi.string(),
    reference: Joi.string(),
  });

  return schema.validate(data);
};

const loginValidate = (data) => {
  const schema = Joi.object({
    tel: Joi.string().required().min(14).max(16),
    password: Joi.string().required().min(6).max(200),
  });

  return schema.validate(data);
}

module.exports.registerValidate = registerValidate;
module.exports.loginValidate = loginValidate;