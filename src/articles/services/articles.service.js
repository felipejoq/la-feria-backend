import {
  GET_TOTAL_ARTICLES_FROM_CONFIG
} from "../../database/queries/config.queries.js";
import {
  CREATE_ARTICLE,
  GET_ARTICLE_BY_ID,
  GET_ARTICLE_BY_SLUG,
  DELETE_ARTICLE_BY_ID,
  UPDATE_ARTICLE_BY_ID,
  GET_ARTICLES_BY_USER_ID,
  GET_ARTICLES_WHIT_PAGINATION,
} from "../../database/queries/articles.queries.js";
import {query} from "../../database/db.js";
import {getResultsWithPagination} from "../../config/utils/results-with-pagination.js";
import {CustomError} from "../../config/errors/custom.error.js";
import {getUUID} from "../../config/plugins/uuid.js";

export class ArticlesService {

  constructor(imagesServices) {
    this.imagesServices = imagesServices;
  }

  async getArticles({page, limit}) {

    const [articlesResult, {rows: [{total_articles}]}] = await Promise.all([
      query(GET_ARTICLES_WHIT_PAGINATION, [(page - 1) * limit, limit]),
      query(GET_TOTAL_ARTICLES_FROM_CONFIG)
    ]);

    const articles = articlesResult?.rows;
    const total = parseInt(total_articles);

    return getResultsWithPagination({
      source: "articles",
      data: articles,
      total,
      page,
      limit
    });
  }

  async getArticleByIdOrSlug({value}) {
    const queryStr = isNaN(value)
      ? GET_ARTICLE_BY_SLUG
      : GET_ARTICLE_BY_ID;

    const {rows: [article]} = await query(queryStr, [value]);

    if (!article)
      throw CustomError.notFound('El artículo no existe');

    return article;
  }

  async getArticleByUserId({userId, page, limit}) {
    const articlesResult = await query(GET_ARTICLES_BY_USER_ID, [userId, (page - 1) * limit, limit]);

    const articles = articlesResult?.rows || [];

    return getResultsWithPagination({
      source: "articles",
      data: articles,
      total: articles.length,
      page,
      limit
    });

  }

  async createArticle({userId, createArticleDto}) {

    const {title, description, isNew, price, category_id, image_url} = createArticleDto;

    const slug = this.generateSlug({title});

    const params = [title, description, slug, price, isNew, userId, category_id];

    const {rows: [newArticle]} = await query(CREATE_ARTICLE, params);

    if(newArticle){
      await this.imagesServices.addImageToArticle({
        urlImg: image_url,
        articleId: newArticle.id
      });
    }

    return newArticle;
  }

  async updateArticleById({user, articleId, updateArticleDto}) {
    const article = await this.getArticleByIdOrSlug({value: articleId});
    const {author: {id}} = article;
    const isAdmin = user.roles.some(role => role.id === 1);

    if (user.id !== id && !isAdmin)
      throw CustomError.forbidden('No tienes permisos para editar este artículo');

    if (updateArticleDto.image_url) {
      await Promise.all([
        this.imagesServices.removeImagesByArticleId({articleId}),
        this.imagesServices.addImageToArticle({urlImg: updateArticleDto.image_url, articleId})
      ]);
    }

    const params = [
      updateArticleDto.title,
      updateArticleDto.description,
      updateArticleDto.isNew,
      updateArticleDto.price,
      updateArticleDto.category_id,
      articleId
    ];

    await query(UPDATE_ARTICLE_BY_ID, params);

    return await this.getArticleByIdOrSlug({value: articleId});
  }

  async deleteArticleById({user, articleId}) {
    const article = await this.getArticleByIdOrSlug({value: articleId});
    const {author: {id: idAuthor}} = article;
    const isAdmin = user.roles.some(role => role.id === 1);

    if (user.id !== idAuthor && !isAdmin)
      throw CustomError.forbidden('No tienes permisos para eliminar este artículo');

    const {rows: [articleDeleted]} = await query(DELETE_ARTICLE_BY_ID, [articleId]);
    return articleDeleted;
  }

  generateSlug({title}) {
    const cleanTitle = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    return `${cleanTitle}-${getUUID()}`;
  }
}