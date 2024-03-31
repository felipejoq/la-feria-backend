import Joi from 'joi';

export const updateUserSchema = Joi.object({
  id: Joi.number().required().min(1).error(new Error('El id es requerida y debe ser un número entero positivo')),
  name: Joi.string().min(3).max(30).required()
    .pattern(new RegExp('^[a-zA-ZñÑáéíóúüÁÉÍÓÚÜ ]{3,30}$'))
    .error(new Error('El nombre es requerido y debe estar entre 3 y 30 carácteres y no se permiten emojis')),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['test', 'com', 'net', 'org'] } })
    .required()
    .error(new Error('El email es requerido, no cumple con el formato o no tiene extensiones permitidas: ["test", "com", "net", "org"]')),
  active: Joi.boolean().optional().error(new Error('Active debe ser booleano: true o false')),
});