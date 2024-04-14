import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required()
    .pattern(new RegExp('^[a-zA-ZñÑáéíóúüÁÉÍÓÚÜ ]{3,30}$'))
    .error(new Error('El nombre es requerido. Mínimo 3 caracteres y máximo 30 sin números ni carácteres especiales')),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['test', 'com', 'net'] } }).required()
    .error(new Error('El email es requerido, no cumple con el formato o no t iene extensiones permitidas: ["test", "com", "net"]')),
  password: Joi.string().required().min(6).max(12)
    .error(new Error('El password es requerido. Longitud de 6 a 12 carácteres')),
  roles: Joi.array().length(1),
  active: Joi.boolean().default(true)
    .error(new Error('Active debe ser booleano: true o false')),
});