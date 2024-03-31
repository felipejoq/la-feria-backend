import Joi from 'joi';

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required()
    .error(new Error('email es requerido')),
  password: Joi.string().min(3).required()
    .error(new Error('password es requerido'))
});