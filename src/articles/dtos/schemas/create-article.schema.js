import Joi from "joi";
export const createArticleSchema = Joi.object({
  title: Joi.string().min(3).required().error(new Error("El título es requerido, debe tener mínimo 3 carácteres")),
  description: Joi.string().min(10).required().error(new Error("La descripción es requerida y debe tener mínimo 10 carácteres")),
  isNew: Joi.boolean().required().error(new Error("El estado del artículo es requerido")),
  image_url: Joi.string().uri().required().error(new Error("La url de la imagen es requerida y debe ser una url válida")),
  price: Joi.number().required().min(1).error(new Error("El precio es requerido y debe ser un número entero positivo")),
  category_id: Joi.number().required().min(1).error(new Error("El id de la categoría es requerida y debe ser un número entero positivo"))
});