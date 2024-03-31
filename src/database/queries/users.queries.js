export const GET_USER_BY_ID_WITH_ROLES = `
SELECT u.id::integer, u.name, u.email, u.image, u.active, ARRAY_AGG(
  json_build_object(
    'id',r.id::integer,
    'role', r.role
  )) AS roles
FROM users AS u
JOIN users_roles AS ur
ON u.id = ur.user_id
JOIN roles AS r
ON ur.role_id = r.id
WHERE u.id = $1
GROUP BY u.id, u.name, u.email, u.image, u.active
ORDER BY u.id                                     
`;

export const GET_USER_BY_EMAIL_WITH_ROLES = `
SELECT u.id::integer, u.name, u.email, u.image, u.active, u.password, ARRAY_AGG(
  json_build_object(
    'id',r.id::integer,
    'role', r.role
  )) AS roles
FROM users AS u
JOIN users_roles AS ur
ON u.id = ur.user_id
JOIN roles AS r
ON ur.role_id = r.id
WHERE u.email = $1
GROUP BY u.id, u.name, u.email, u.image, u.active, u.password
`;

export const GET_USERS_AND_ROLES_PAGINATE = `
SELECT u.id::integer, u.name, u.email, u.image, u.active, ARRAY_AGG(
  json_build_object(
    'id', r.id::integer,
    'role', r.role
  )) AS roles
 FROM users AS u
 INNER JOIN users_roles AS ur
 ON u.id = ur.user_id
 INNER JOIN roles AS r
 ON r.id = ur.role_id
 GROUP BY u.id, u.name, u.email, u.image, u.active
 ORDER BY u.id
 OFFSET $1
 LIMIT $2
`;

export const GET_USERS = `
SELECT username, email FROM users
`;

export const GET_ROL_BY_ID = `
SELECT *, id::integer FROM roles WHERE id = $1
`;

export const GET_ALL_ROLES_ID = `
SELECT ARRAY_AGG(id::integer) AS rolesId FROM roles
`;

export const GET_USERS_PAGINATE = `
SELECT id::integer, name, email FROM users OFFSET $1 LIMIT $2
`;

export const GET_ROLE_BY_ID = `
SELECT *, id::integer FROM roles WHERE id = $1
`;

export const CREATE_USER = `
INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *, id::integer
`;

export const SET_ROL_TO_USER = `
INSERT INTO users_roles (user_id, role_id) VALUES ($1, $2) RETURNING *, id::integer
`;

export const UPDATE_USER_BY_ID = `
UPDATE users SET name = $1, email = $2, active = $3 WHERE id = $4 RETURNING *, id::integer
`;

export const UPDATE_STATUS_USER_BY_ID = `
UPDATE users SET active = $1 WHERE id = $2 RETURNING *, id::integer
`;

export const UPDATE_USER_IMAGE_BY_ID = `
UPDATE users SET image = $1 WHERE id = $2;
`;

export const DELETE_USER_BY_ID = `
DELETE FROM users WHERE id = $1 RETURNING *, id::integer
`;

export const DELETE_USERS_ROLES_BY_USER_ID = `
DELETE FROM users_roles WHERE user_id = $1
`;