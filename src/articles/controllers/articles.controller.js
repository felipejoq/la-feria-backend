export class ArticlesController {
  constructor() {
    // DI
  }

  getArticles = (req, res) => {
    res.json({ message: 'Este endpoint retorna post públicos' });
  }

  getArticleById = (req, res) => {
    const { articleId } = req.params;
    res.json({ message: `Este endpoint retorna un post por id ${articleId}` });
  }

  createArticle = (req, res) => {
    res.json({ message: 'Este endpoint crea un post' });
  }

  updateArticleById = (req, res) => {
    const { articleId } = req.params;
    res.json({ message: `Este endpoint edita un post por su id ${articleId}` });
  }

  deleteArticleById = (req, res) => {
    const { articleId } = req.params;
    res.json({ message: `Este endpoint elimina un post por su id ${articleId}` });
  }
}