export const DELETE_IMAGES_BY_ARTICLE_ID = `
DELETE FROM images_article WHERE article_id = $1;
`;

export const ADD_IMAGE_TO_ARTICLE = `
INSERT INTO images_article (url_img, article_id) VALUES ($1, $2);
`;