DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    name VARCHAR(150) NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price NUMERIC(10,2) NOT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- INTENTIONALLY PLAINTEXT PASSWORDS FOR THE VULNERABLE LAB VERSION.
INSERT INTO users (username, password, role, name) VALUES
('admin', 'Admin123!', 'ADMIN', 'Administrador'),
('cliente1', 'Cliente123!', 'CUSTOMER', 'Cliente Uno'),
('cliente2', 'Cliente123!', 'CUSTOMER', 'Cliente Dos');

INSERT INTO products (name, price) VALUES
('Laptop', 6500.00),
('Mouse', 150.00),
('Teclado', 350.00),
('Monitor', 1800.00);

INSERT INTO orders (user_id, product_id, quantity) VALUES
(2, 1, 1),
(2, 2, 2),
(3, 3, 1),
(3, 4, 1);
