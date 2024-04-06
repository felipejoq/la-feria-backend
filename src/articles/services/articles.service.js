import {
  GET_TOTAL_ARTICLES_FROM_CONFIG
} from "../../database/queries/config.queries.js";
import {
  GET_ARTICLE_BY_ID,
  GET_ARTICLE_BY_SLUG, GET_ARTICLES_BY_USER_ID,
  GET_ARTICLES_WHIT_PAGINATION, UPDATE_ARTICLE_BY_ID
} from "../../database/queries/articles.queries.js";
import {query} from "../../database/db.js";
import {getResultsWithPagination} from "../../config/utils/results-with-pagination.js";
import {CustomError} from "../../config/errors/custom.error.js";

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

  async updateArticleById({userId, articleId, updateArticleDto}) {
    const article = await this.getArticleByIdOrSlug({value: articleId});
    const {author: {id}} = article;

    if(!article)
      throw CustomError.notFound('El artículo no existe');

    if (userId !== id)
      throw CustomError.forbidden('No tienes permisos para editar este artículo');

    const {rows: [articleUpdated]} = await query(UPDATE_ARTICLE_BY_ID, [updateArticleDto.title, updateArticleDto.description, updateArticleDto.isNew, updateArticleDto.price, updateArticleDto.category_id, articleId]);

    return articleUpdated;
  }
}