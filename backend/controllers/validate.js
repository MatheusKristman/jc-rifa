import Joi from "@hapi/joi";

export const registerValidate = (data) => {
  const schema = Joi.object({
    profileImage: Joi.binary(),
    name: Joi.string().required().min(3).max(50),
    cpf: Joi.string().required().min(11),
    email: Joi.string().required().min(3).max(50),
    tel: Joi.string().required().min(10).max(15),
  });

  return schema.validate(data);
};

export const updateValidate = (data) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    profileImage: Joi.binary(),
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().required().min(3).max(50),
    tel: Joi.string().required().min(10).max(15),
    cpf: Joi.string().required().min(11),
    cep: Joi.string().allow(null, ""),
    address: Joi.string().allow(null, ""),
    number: Joi.string().allow(null, ""),
    neighborhood: Joi.string().allow(null, ""),
    complement: Joi.string().allow(null, ""),
    uf: Joi.string().allow(null, ""),
    city: Joi.string().allow(null, ""),
    reference: Joi.string().allow(null, ""),
  });

  return schema.validate(data);
};

export const loginValidate = (data) => {
  const schema = Joi.object({
    tel: Joi.string().required().min(15).max(16),
  });

  return schema.validate(data);
};

export const loginAdminValidate = (data) => {
  const schema = Joi.object({
    tel: Joi.string().required().min(15).max(16),
    password: Joi.string().required().min(8),
  });

  return schema.validate(data);
};

export const createNewRaffleValidate = (data) => {
  const schema = Joi.object({
    raffleImage: Joi.binary(),
    title: Joi.string().required(),
    subtitle: Joi.string().required(),
    description: Joi.string().allow(null, ""),
    price: Joi.string(),
    quantNumbers: Joi.number(),
  });

  return schema.validate(data);
};

export const updateRaffleValidate = (data) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    raffleImage: Joi.binary(),
    title: Joi.string().required(),
    subtitle: Joi.string().required(),
    description: Joi.string().allow(null, ""),
    price: Joi.string(),
  });

  return schema.validate(data);
};
