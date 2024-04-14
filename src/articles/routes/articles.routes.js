import {Router} from "express";
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

    const {validateJWT} = AuthMiddleware;
    const {validRolesArticles} = RoleMiddleware;

    articlesRouter.get('/', articlesController.getArticles);
    articlesRouter.get('/search', articlesController.getArticlesByTerm);
    articlesRouter.get('/:articleValue', articlesController.getArticleById);
    articlesRouter.get('/user/:userId', articlesController.getArticlesByUserId);
    articlesRouter.post('/', [validateJWT, validRolesArticles([1, 2, 3])], articlesController.createArticle);
    articlesRouter.put('/:articleId', [validateJWT, validRolesArticles([1, 2, 3])], articlesController.updateArticleById);
    articlesRouter.delete('/:articleId', [validateJWT, validRolesArticles([1, 2, 3])], articlesController.deleteArticleById);

    return articlesRouter;
  }

}