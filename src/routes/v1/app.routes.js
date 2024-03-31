import { Router } from "express";
import {ArticlesRoutes} from "../../articles/routes/articles.routes.js";
import {UsersRoutes} from "../../users/routes/users.routes.js";

export class AppRouter {

  static get routes() {
    const AppRouter = Router();

    AppRouter.use('/api/v1/article', ArticlesRoutes.routes);
    AppRouter.use('/api/v1/user', UsersRoutes.routes);

    return AppRouter;
  }

}