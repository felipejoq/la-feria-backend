import {createArticleSchema} from "./schemas/create-article.schema.js";

export class CreateArticleDto {
  constructor(title, description, price, isNew, image_url, category_id) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.isNew = isNew;
    this.image_url = image_url;
    this.category_id = category_id;
  }

  static create({ body }) {
    const { title, description, price, isNew, image_url, category_id } = body;

    const result = createArticleSchema.validate({ title, description, price, isNew, image_url, category_id });

    if (result.error)
      return [result.error.message, null]

    return [null, { title, description, price, isNew, image_url, category_id }];
  }

}