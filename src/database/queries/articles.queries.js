export const GET_ARTICLES_BY_USER_ID = `
SELECT
  a.id::integer,
  a.title,
  a.description,
  a.slug,
  a.price::float,
  a.active,
  a.created_at,
  a.updated_at,
  json_build_object(
    'id', u.id::integer,
    'name', u.name,
    'email', u.email,
    'image', u.image
  ) AS author,
  json_agg(json_build_object(
    'id', i.id::integer, 
    'url_img', 
    i.url_img)) AS article_images
FROM articles a
INNER JOIN users u
ON a.user_id = u.id
LEFT JOIN images_article i
ON a.id = i.article_id
WHERE u.id = $1
GROUP BY a.id, a.title, a.description, a.slug, a.price, a.active, a.created_at, a.updated_at, u.id, u.name, u.email, u.image
ORDER BY a.id
OFFSET $2
LIMIT $3
`;

export const GET_ARTICLES_WHIT_PAGINATION = `
SELECT
a.id::integer,
a.title,
a.description,
a.slug,
a.price::float,
a.active,
a.created_at,
a.updated_at,
json_build_object(
  'id', u.id::integer,
  'name', u.name,
  'email', u.email,
  'image', u.image
) AS author,
json_build_object(
  'id', c.id::integer,
  'title', c.title
) AS category,
json_agg(json_build_object(
  'id', i.id::integer, 
  'url_img', 
  i.url_img)) AS article_images
FROM articles a
INNER JOIN users u ON a.user_id = u.id
LEFT JOIN images_article i ON a.id = i.article_id
INNER JOIN categories c ON a.category_id = c.id
WHERE a.active = true
GROUP BY a.id, a.title, a.description, a.slug, a.price, a.active, a.created_at, a.updated_at, c.id, u.id, u.name, u.email, u.image
ORDER BY a.id OFFSET $1 LIMIT $2
`;

export const GET_ALL_ARTICLES_WHIT_PAGINATION = `
SELECT
a.id::integer,
a.title,
a.description,
a.slug,
a.price::float,
a.active,
a.created_at,
a.updated_at,
json_build_object(
  'id', u.id::integer,
  'name', u.name,
  'email', u.email,
  'image', u.image
) AS author,
json_agg(json_build_object(
  'id', i.id, 
  'url_img', 
  i.url_img)) AS article_images
FROM articles a
INNER JOIN users u
ON a.user_id = u.id
LEFT JOIN images_article i
ON a.id = i.article_id
GROUP BY a.id, a.title, a.description, a.slug, a.price, a.active, a.created_at, a.updated_at, u.id, u.name, u.email, u.image
ORDER BY a.id
OFFSET $1
LIMIT $2
`;

export const GET_ARTICLE_BY_ID = `
SELECT
a.id::integer,
a.title,
a.description,
a.slug,
a.price::float,
a.active,
a.created_at,
a.updated_at,
json_build_object(
  'id', c.id::integer,
  'title', c.title
) AS category,
json_build_object(
  'id', u.id::integer,
  'name', u.name,
  'email', u.email,
  'image', u.image
) AS author,
json_agg(json_build_object(
  'id', i.id::integer, 
  'url_img', 
  i.url_img)) AS article_images
FROM articles a
INNER JOIN users u ON a.user_id = u.id
LEFT JOIN images_article i ON a.id = i.article_id
INNER JOIN categories c ON a.category_id = c.id
WHERE a.id = $1
GROUP BY a.id, a.title, a.description, a.slug, a.price, a.active, a.created_at, a.updated_at, u.id, u.name, u.email, u.image, c.id
`;

export const GET_ARTICLE_BY_SLUG = `
SELECT
a.id::integer,
a.title,
a.description,
a.slug,
a.price::float,
a.active,
a.created_at,
a.updated_at,
json_build_object(
  'id', c.id::integer,
  'title', c.title
) AS category,
json_build_object(
  'id', u.id::integer,
  'name', u.name,
  'email', u.email,
  'image', u.image
) AS author,
json_agg(json_build_object(
  'id', i.id::integer, 
  'url_img', 
  i.url_img)) AS article_images
FROM articles a
INNER JOIN users u ON a.user_id = u.id
LEFT JOIN images_article i ON a.id = i.article_id
INNER JOIN categories c ON a.category_id = c.id
WHERE a.active = true AND a.slug = $1
GROUP BY a.id, a.title, a.description, a.slug, a.price, a.active, a.created_at, a.updated_at, u.id, u.name, u.email, u.image, c.id
`;

export const CREATE_ARTICLE = `
INSERT INTO articles ( title, description, slug, price, isNew, user_id, category_id)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *, id::integer, user_id::integer, category_id::integer
`;

export const GET_IMAGE_BY_ID = `
SELECT * FROM images_article WHERE id = $1
`;

export const UPDATE_ARTICLE_BY_ID = `
UPDATE articles
SET title = $1, description = $2, isNew = $3, price = $4, category_id = $5, updated_at = current_timestamp
WHERE id = $6 RETURNING *, id::integer, price::float, user_id::integer, category_id::integer
`;

export const UPDATE_ARTICLE_STATUS = `
UPDATE articles SET active = $1 WHERE id = $2
`;

export const DELETE_ARTICLE_BY_ID = `
DELETE FROM articles WHERE id = $1 RETURNING *, id::integer, price::float, user_id::integer
`;

export const SET_IMAGES_TO_ARTICLE = `
INSERT INTO images_article (url_img, article_id)
VALUES ($1, $2) RETURNING id::integer, url_img
`;

export const DELETE_IMAGE_BY_ARTICLE_IMAGE_ID = `
DELETE FROM images_article WHERE article_id = $1 AND id = $2 RETURNING *, id::integer, article_id::integer
`;

export const GET_ALL_IMAGES_ARTICLES = `
SELECT *, id::integer, article_id::integer FROM images_article
`;