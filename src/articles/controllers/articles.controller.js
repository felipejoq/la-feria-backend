import {PaginationDto} from "../../common/dtos/pagination.dto.js";
import {handleError} from "../../config/errors/handler.error.js";
import {UpdateArticleDto} from "../dtos/update-article.dto.js";
import {CustomError} from "../../config/errors/custom.error.js";

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

  getArticleByUserId = (req, res) => {
    const {userId} = req.params;
    const {page = 1, limit = 10} = req.query;

    const [error, pagination] = PaginationDto.create({
      page: parseInt(page), limit: parseInt(limit)
    });

    if (error) return res.status(400).json({error});

    this.articlesService.getArticleByUserId({userId, page, limit})
      .then(article => res.json(article))
      .catch(error => handleError(error, res));
  }

  createArticle = (req, res) => {
    res.json({message: 'Este endpoint crea un post'});
  }

  updateArticleById = (req, res) => {
    const {articleId} = req.params;
    const {id: userId} = req.body.user;

    const [error, updateArticleDto] = UpdateArticleDto.create({body: req.body});

    if (error)
      return handleError(CustomError.badRequest(error), res);

    this.articlesService.updateArticleById({userId, articleId, updateArticleDto})
      .then(article => res.json(article))
      .catch(error => handleError(error, res));
  }

  deleteArticleById = (req, res) => {
    const {articleId} = req.params;
    res.json({message: `Este endpoint elimina un post por su id ${articleId}`});
  }
}