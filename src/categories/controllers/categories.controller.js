import {handleError} from "../../config/errors/handler.error.js";

export class CategoriesController {

  constructor(categoriesService) {
    this.categoriesService = categoriesService;
  }

  getAllCategories = (req, res) => {
    this.categoriesService.getAllCategories()
      .then(categories => res.json(categories))
      .catch(error => handleError(error, res));
  }

}