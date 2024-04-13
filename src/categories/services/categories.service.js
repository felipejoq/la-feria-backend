import {query} from "../../database/db.js";
import {GET_ALL_CATEGORIES} from "../../database/queries/categories.queries.js";

export class CategoriesService {

  constructor() {
  }

  async getAllCategories() {
    const categoriesResult = await query(GET_ALL_CATEGORIES, []);
    return categoriesResult?.rows;
  }

}