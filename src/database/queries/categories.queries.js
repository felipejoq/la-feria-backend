export const GET_ALL_CATEGORIES = `
SELECT * FROM categories;
`;

export const GET_ALL_CATEGORIES_WHIT_PAGINATION = `
SELECT * FROM categories OFFSET $1 LIMIT $2;
`;