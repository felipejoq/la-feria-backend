DROP TABLE IF EXISTS users, roles, users_roles, config, articles, images_article;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY (START WITH 1) PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    image VARCHAR DEFAULT 'https://blog.uncodigo.com/wp-content/uploads/2023/12/profile.png' NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    password VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT GENERATED ALWAYS AS IDENTITY (START WITH 1) PRIMARY KEY,
    role VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS users_roles (
    id BIGINT GENERATED ALWAYS AS IDENTITY (START WITH 1) PRIMARY KEY,
    user_id BIGINT,
    role_id BIGINT,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS config (
    id BIGINT GENERATED ALWAYS AS IDENTITY (START WITH 1) PRIMARY KEY,
    site_name VARCHAR DEFAULT 'MyStore Demo' NOT NULL,
    site_description VARCHAR DEFAULT 'MyStore Demo Description' NOT NULL,
    enable_registration BOOLEAN DEFAULT true NOT NULL,
    total_users BIGINT DEFAULT 7 NOT NULL,
    total_articles BIGINT DEFAULT 11 NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY (START WITH 1) PRIMARY KEY,
    title VARCHAR DEFAULT 'general' NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
    id BIGINT GENERATED ALWAYS AS IDENTITY (START WITH 1) PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    slug VARCHAR NOT NULL,
    price DECIMAL(10,2),
    new BOOLEAN DEFAULT true NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    updated_at TIMESTAMP DEFAULT current_timestamp NOT NULL,
    user_id BIGINT,
    category_id BIGINT,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
  );

CREATE TABLE IF NOT EXISTS
  images_article (
    id BIGINT GENERATED ALWAYS AS IDENTITY (START WITH 1) PRIMARY KEY,
    url_img VARCHAR DEFAULT 'https://blog.uncodigo.com/wp-content/uploads/2023/12/no-img.jpg' NOT NULL,
    article_id BIGINT NOT NULL,
    -- user_id BIGINT,
    -- CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT fk_article_id FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE
  );

INSERT INTO
  users (name, email, password)
VALUES
  ('Felipe','felipe@test.com','$2b$10$12HQGrt8GM0BmJut/I8.QuWRVKySK1HxJtJH3CeBxc.fFysQ7ReYa'),
  ('Hugo','hugo@test.com','$2b$10$j4O1oZg9BVcv7f0wPeGDT.c1Ckgxb5i.58dk59xlyWiyk15M9inXi'),
  ('Alicia','alicia@test.com','$2b$10$dfUJbJk7cmd8w8YS6B9BX.gtZ4TkLBguAXtq1bSzxCNg8s15nV9aS'),
  ('Tomas','tomas@test.com','$2b$10$A8m/YuIzpgsOHmLj8n1KG.ZG2XAUK81p1LY85TBRPDn1vLroYbcMC'),
  ('Hilda','hilda@test.com','$2b$10$iVKZei5YxkX8BPbntnkYjOqF70lf.zbMk2mClHZvAeKil.b7xHI4u'),
  ('Roberto','roberto@test.com','$2b$10$cS7XCMGbK4BpH1k/y34xUOxII3YMmBQ2eQDn7O1aCzXkSREG5td7K');

INSERT INTO
  users (name, email, active, password)
VALUES
  ('Maria','maria@test.test',false,'$2b$10$MG071U/B.mdPpoyzeMA5i.uTPSBZdkFi3gD/HTvoczJed2w/uJhmy');

INSERT INTO
  roles (role)
VALUES
  ('ADMIN'),
  ('SELLER'),
  ('USER');

INSERT INTO
  users_roles (user_id, role_id)
VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (2, 2),
  (2, 3),
  (3, 3),
  (4, 3),
  (5, 3),
  (6, 3),
  (7, 3);

INSERT INTO categories (title) VALUES ('general'), ('tecnología'), ('alimentos'), ('vestuario');

INSERT INTO articles (title, description, slug, price, new, user_id, category_id, created_at, updated_at, active)
VALUES (
  'Lindo vestido de verano',
  'Este vestido es perfecto para una salida con amigos, una cena romántica o incluso una boda. Es elegante y sofisticado, pero también lo suficientemente informal para usarlo en el día a día.',
  'lindo-vestido-de-verano',
  20000,
  true,
  1,
  4,
  '2023-12-24 12:37:00',
  '2023-12-24 12:37:00',
  true
),(
  'Televisión inteligente 4K',
  'Esta televisión es perfecta para cualquier hogar. Es fácil de usar y tiene todas las funciones que necesitas para disfrutar de tu entretenimiento.',
  'television-inteligente-4k',
  60000,
  true,
  2,
  2,
  '2023-12-24 12:37:00',
  '2023-12-24 12:37:00',
  true
),(
  'Juego de herramientas de bricolaje',
  'Este juego es una excelente inversión para cualquier hogar. Es duradero y te durará años.',
  'juego-de-herramientas-de-bricolaje',
  33000,
  false,
  3,
  1,
  '2023-12-24 12:37:00',
  '2023-12-24 12:37:00',
  true
),(
  'Bicicleta de montaña',
  'Esta bicicleta es perfecta para cualquier ciclista entusiasta. Es duradera y te durará años.',
  'bicicleta-de-montana',
  120000,
  true,
  7,
  1,
  '2023-12-24 12:37:00',
  '2023-12-24 12:37:00',
  false
),(
  'Juego de mesa de estrategia',
  'Este juego es perfecto para cualquier amante de los juegos de mesa. Es desafiante y te mantendrá entretenido durante horas.',
  'juego-de-mesa-de-estragegia',
  15500,
   true,
  7,
  2,
  '2023-12-24 12:37:00',
  '2023-12-24 12:37:00',
  false
),(
  'Libro de cocina vegana',
  'Este libro es perfecto para cualquier persona que quiera probar la cocina vegana. Es fácil de seguir y las recetas son deliciosas.',
  'libro-de-cocina-vegana',
  5690,
  false,
  1,
  3,
  '2023-12-24 12:37:00',
  '2023-12-24 12:37:00',
  true
), (
  'Tablet Samsung Galaxy Tab S8 Ultra',
  'Esta tablet es perfecta para cualquier persona que quiera una tablet potente y versátil. Es ideal para ver películas, jugar, trabajar o estudiar.',
  'tablet-samsung-galaxy-tab-s8-ultra',
  47890,
  true,
  1,
  2,
  '2023-12-24 12:37:00',
  '2023-12-24 12:37:00',
  true
),(
  'Par de zapatillas Nike Air Jordan 1',
  'Estas zapatillas son perfectas para cualquier ocasión. Son elegantes y modernas, pero también son muy duraderas.',
  'par-de-zapatillas-nike-air-jordan-1',
  32560,
  true,
  2,
  4,
  '2023-12-24 12:37:00',
  '2023-12-24 12:37:00',
  true
), (
  'Auriculares inalámbricos Sony WH-1000XM5',
  'Estos auriculares son perfectos para cualquier persona que quiera disfrutar de su música o audio sin distracciones. Son cómodos de llevar y tienen una batería de larga duración.',
  'auriculares-inalambricos-sony-wh-1000xm5',
  14600,
  true,
  3,
  2,
  '2023-12-24 12:37:00',
  '2023-12-24 12:37:00',
  true
), (
  'Bicicleta eléctrica',
  'Esta bicicleta es perfecta para cualquier persona que quiera una forma de transporte ecológica y eficiente. Es fácil de usar y tiene una autonomía de hasta 50 kilómetros.',
  'bicicleta-electrica',
  90500,
  true,
  7,
  1,
  '2023-12-24 12:37:00',
  '2023-12-24 12:37:00',
  true
), (
  'Set de herramientas de jardinería',
  'Este set es una excelente inversión para cualquier hogar. Es duradero y te durará años.',
  'set-de-herramientas-jardineria',
  23000,
  true,
  7,
  1,
  '2023-12-24 12:37:00',
  '2023-12-24 12:37:00',
  false
);

INSERT INTO
  images_article (article_id)
VALUES
  (1),
  (1),
  (2),
  (2),
  (2),
  (3),
  (4),
  (4),
  (4),
  (4),
  (5),
  (6),
  (7),
  (8),
  (8),
  (8),
  (8),
  (9),
  (9),
  (9);

-- FUNCIÓN INCREMENTA TOTAL USERS EN CONFIG
CREATE OR REPLACE FUNCTION increment_total_users()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE config SET total_users = total_users + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGER INCREMENTA TOTAL USERS EN CONFIG
CREATE TRIGGER after_insert_users
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION increment_total_users();

-- FUNCIÓN INCREMENTA TOTAL ARTICLES EN CONFIG
CREATE OR REPLACE FUNCTION increment_total_articles()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE config SET total_articles = total_articles + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- TRIGGER INCREMENTA TOTAL ARTICLES EN CONFIG
CREATE TRIGGER after_insert_articles
AFTER INSERT ON articles
FOR EACH ROW
EXECUTE FUNCTION increment_total_articles();