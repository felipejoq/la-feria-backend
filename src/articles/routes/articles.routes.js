import { Router } from "express";
import {ArticlesController} from "../controllers/articles.controller.js";

export class ArticlesRoutes {

  static get routes() {

    const articlesRouter = Router();
    const articlesController = new ArticlesController();

    articlesRouter.get('/', articlesController.getArticles);
    articlesRouter.get('/:articleId', articlesController.getArticleById);
    articlesRouter.post('/', articlesController.createArticle);
    articlesRouter.put('/:articleId', articlesController.updateArticleById);
    articlesRouter.delete('/:articleId', articlesController.deleteArticleById);

    return articlesRouter;
  }

}