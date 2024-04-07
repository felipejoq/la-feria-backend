import {query} from "../../database/db.js";
import {ADD_IMAGE_TO_ARTICLE, DELETE_IMAGES_BY_ARTICLE_ID} from "../../database/queries/images.queries.js";

export class ImagesServices {
  constructor(){}

  async removeImagesByArticleId({articleId}) {
    const {rows} = await query(DELETE_IMAGES_BY_ARTICLE_ID, [articleId]);
    return rows;
  }

  async addImageToArticle({urlImg, articleId}) {
    const {rows} = await query(ADD_IMAGE_TO_ARTICLE, [urlImg, articleId]);
    return rows;
  }
}