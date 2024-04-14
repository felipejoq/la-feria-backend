import {PaginationDto} from "../../common/dtos/pagination.dto.js";
import {handleError} from "../../config/errors/handler.error.js";
import {UpdateArticleDto} from "../dtos/update-article.dto.js";
import {CustomError} from "../../config/errors/custom.error.js";
import {CreateArticleDto} from "../dtos/create-article.dto.js";

export class ArticlesController {
  constructor(articlesService) {
    this.articlesService = articlesService;
  }

  getArticles = (req, res) => {
    const {page = 1, limit = 10} = req.query;

    const [error, pagination] = PaginationDto.create({
      page: parseInt(page), limit: parseInt(limit)
    });

    if (error) return res.status(400).json({error});

    this.articlesService.getArticles(pagination)
      .then(articles => res.json(articles))
      .catch(error => handleError(error, res));

  }

  getArticleById = (req, res) => {
    const {articleValue} = req.params;

    this.articlesService.getArticleByIdOrSlug({value: articleValue})
      .then(article => res.json(article))
      .catch(error => handleError(error, res));
  }

  createArticle = (req, res) => {
    const {id: userId} = req.body.user;

    const [error, createArticleDto] = CreateArticleDto.create({body: req.body});

    if (error)
      return handleError(CustomError.badRequest(error), res);

    this.articlesService.createArticle({userId, createArticleDto})
      .then(article => res.json(article))
      .catch(error => handleError(error, res));
  }

  getArticlesByUserId = (req, res) => {
    const {userId} = req.params;
    const {page = 1, limit = 10} = req.query;

    const [error, pagination] = PaginationDto.create({
      page: parseInt(page), limit: parseInt(limit)
    });

    if (error) return res.status(400).json({error});

    this.articlesService.getArticleByUserId({userId, page, limit})
      .then(articles => res.json(articles))
      .catch(error => handleError(error, res));
  }

  getArticlesByTerm = (req, res) => {
    const {term, page = 1, limit = 10} = req.query;

    if (!term)
      return handleError(CustomError.badRequest('El término de búsqueda es requerido'), res);

    const [error, pagination] = PaginationDto.create({
      page: parseInt(page), limit: parseInt(limit)
    });

    if (error) return res.status(400).json({error});

    this.articlesService.getArticlesByTerm({term, page, limit})
      .then(articles => res.json(articles))
      .catch(error => handleError(error, res));
  }

  updateArticleById = (req, res) => {
    const {articleId} = req.params;
    const user = req.body.user;

    const [error, updateArticleDto] = UpdateArticleDto.create({body: req.body});

    if (error)
      return handleError(CustomError.badRequest(error), res);

    this.articlesService.updateArticleById({user, articleId, updateArticleDto})
      .then(article => res.json(article))
      .catch(error => handleError(error, res));
  }

  deleteArticleById = (req, res) => {
    const {articleId} = req.params;
    const user = req.body.user;

    if (isNaN(articleId) || Number(articleId) <= 0)
      return handleError(CustomError.badRequest('El id del artículo debe ser un número mayor que cero'), res);

    this.articlesService.deleteArticleById({user, articleId})
      .then(articleDeleted => res.json(articleDeleted))
      .catch(error => handleError(error, res));
  }
}