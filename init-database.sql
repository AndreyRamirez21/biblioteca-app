-- ===============================================
-- SCRIPT DE INICIALIZACIÓN COMPLETO
-- Sistema de Gestión de Biblioteca Digital
-- ===============================================

-- ===============================================
-- BASE DE DATOS: library_users
-- ===============================================
CREATE DATABASE IF NOT EXISTS library_users;
USE library_users;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Datos iniciales de usuarios
INSERT INTO users (email, password, first_name, last_name, phone, role, active, created_at) VALUES
('admin@library.com', 'password123', 'Admin', 'System', '3001234567', 'ADMIN', true, NOW()),
('juan.perez@email.com', 'password123', 'Juan', 'Pérez', '3009876543', 'USER', true, NOW()),
('maria.garcia@email.com', 'password123', 'María', 'García', '3012345678', 'USER', true, NOW()),
('carlos.lopez@email.com', 'password123', 'Carlos', 'López', '3007654321', 'USER', true, NOW()),
('ana.martinez@email.com', 'password123', 'Ana', 'Martínez', '3015556677', 'USER', true, NOW())
ON DUPLICATE KEY UPDATE email=email;

-- ===============================================
-- BASE DE DATOS: library_books
-- ===============================================
CREATE DATABASE IF NOT EXISTS library_books;
USE library_books;

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    INDEX idx_name (name)
);

CREATE TABLE IF NOT EXISTS books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(50) NOT NULL UNIQUE,
    publication_year INT NOT NULL,
    description TEXT,
    available_copies INT NOT NULL DEFAULT 0,
    total_copies INT NOT NULL DEFAULT 0,
    category_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_title (title),
    INDEX idx_author (author),
    INDEX idx_isbn (isbn),
    INDEX idx_category (category_id)
);

-- Datos iniciales de categorías
INSERT INTO categories (name, description) VALUES
('Ficción', 'Novelas y cuentos de ficción'),
('Ciencia', 'Libros de ciencia y divulgación científica'),
('Historia', 'Libros sobre acontecimientos históricos'),
('Tecnología', 'Libros sobre programación y tecnología'),
('Biografías', 'Biografías y memorias')
ON DUPLICATE KEY UPDATE name=name;

-- Datos iniciales de libros
INSERT INTO books (title, author, isbn, publication_year, description, available_copies, total_copies, category_id, created_at) VALUES
('Cien años de soledad', 'Gabriel García Márquez', '978-0307474728', 1967, 'Obra maestra del realismo mágico que narra la historia de la familia Buendía', 5, 5, 1, NOW()),
('1984', 'George Orwell', '978-0451524935', 1949, 'Novela distópica clásica sobre un futuro totalitario', 3, 5, 1, NOW()),
('Sapiens', 'Yuval Noah Harari', '978-0062316097', 2011, 'Una breve historia de la humanidad desde la edad de piedra', 4, 4, 3, NOW()),
('Clean Code', 'Robert C. Martin', '978-0132350884', 2008, 'Guía para escribir código limpio y mantenible', 2, 3, 4, NOW()),
('El principito', 'Antoine de Saint-Exupéry', '978-0156012195', 1943, 'Fábula poética y filosófica sobre un pequeño príncipe', 6, 6, 1, NOW()),
('Breve historia del tiempo', 'Stephen Hawking', '978-0553380163', 1988, 'Introducción accesible a la cosmología moderna', 3, 3, 2, NOW()),
('Don Quijote de la Mancha', 'Miguel de Cervantes', '978-0060934347', 1605, 'Obra cumbre de la literatura española', 4, 4, 1, NOW()),
('El código Da Vinci', 'Dan Brown', '978-0307474278', 2003, 'Thriller que mezcla historia, arte y misterio', 5, 5, 1, NOW())
ON DUPLICATE KEY UPDATE isbn=isbn;

-- ===============================================
-- BASE DE DATOS: library_loans
-- ===============================================
CREATE DATABASE IF NOT EXISTS library_loans;
USE library_loans;

CREATE TABLE IF NOT EXISTS loans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    loan_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(20) NOT NULL,
    notes VARCHAR(500),
    created_at DATETIME NOT NULL,
    INDEX idx_user (user_id),
    INDEX idx_book (book_id),
    INDEX idx_status (status),
    INDEX idx_loan_date (loan_date),
    INDEX idx_due_date (due_date)
);

-- Datos iniciales de préstamos
INSERT INTO loans (user_id, book_id, loan_date, due_date, return_date, status, notes, created_at) VALUES
(2, 1, '2024-11-15', '2024-11-29', NULL, 'ACTIVE', 'Primer préstamo del usuario', NOW()),
(3, 2, '2024-11-20', '2024-12-04', NULL, 'ACTIVE', NULL, NOW()),
(4, 4, '2024-11-01', '2024-11-15', '2024-11-14', 'RETURNED', 'Devuelto a tiempo', NOW()),
(2, 5, '2024-11-25', '2024-12-09', NULL, 'ACTIVE', NULL, NOW()),
(3, 6, '2024-11-10', '2024-11-24', '2024-11-23', 'RETURNED', 'Devuelto en buen estado', NOW())
ON DUPLICATE KEY UPDATE user_id=user_id;

-- ===============================================
-- VERIFICACIÓN DE DATOS
-- ===============================================
SELECT 'Usuarios creados:' AS Info, COUNT(*) AS Total FROM library_users.users;
SELECT 'Categorías creadas:' AS Info, COUNT(*) AS Total FROM library_books.categories;
SELECT 'Libros creados:' AS Info, COUNT(*) AS Total FROM library_books.books;
SELECT 'Préstamos creados:' AS Info, COUNT(*) AS Total FROM library_loans.loans;