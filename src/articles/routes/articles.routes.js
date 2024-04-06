import { Router } from "express";
import {ArticlesController} from "../controllers/articles.controller.js";
import {ArticlesService} from "../services/articles.service.js";
import {AuthMiddleware} from "../../users/middlewares/auth.middleware.js";
import {RoleMiddleware} from "../../middlewares/role.middleware.js";
import {ImagesServices} from "../../images/services/images.services.js";

export class ArticlesRoutes {

  static get routes() {

    const articlesRouter = Router();
    const imagesService = new ImagesServices();
    const articlesService = new ArticlesService(imagesService);
    const articlesController = new ArticlesController(articlesService);

    articlesRouter.get('/', articlesController.getArticles);
    articlesRouter.get('/:articleValue', articlesController.getArticleById);
    articlesRouter.get('/user/:userId', articlesController.getArticleByUserId);
    articlesRouter.post('/', articlesController.createArticle);
    articlesRouter.put('/:articleId',[AuthMiddleware.validateJWT, RoleMiddleware.validRolesArticles([1, 3])], articlesController.updateArticleById);
    articlesRouter.delete('/:articleId', articlesController.deleteArticleById);

    return articlesRouter;
  }

}