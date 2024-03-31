export const GET_TOTAL_USERS_FROM_CONFIG = `
SELECT total_users FROM config
`;

export const GET_TOTAL_ARTICLES_FROM_CONFIG = `
SELECT total_articles FROM config
`;

export const IS_REGISTRATION_ACTIVE = `
SELECT enable_registration FROM config
`;