import {Router} from "express";
import {CategoriesController} from "../controllers/categories.controller.js";
import {CategoriesService} from "../services/categories.service.js";

export class CategoriesRoutes {
  static get routes() {

    const categoriesRoutes = Router();

    const categoriesService = new CategoriesService();
    const categoriesController = new CategoriesController(categoriesService);

    categoriesRoutes.get('/', categoriesController.getAllCategories);

    return categoriesRoutes;
  }
}