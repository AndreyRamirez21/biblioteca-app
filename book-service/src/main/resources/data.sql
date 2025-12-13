-- Datos iniciales para categorías
INSERT INTO categories (name, description) VALUES
('Ficción', 'Novelas y cuentos de ficción'),
('Ciencia', 'Libros de ciencia y divulgación científica'),
('Historia', 'Libros sobre acontecimientos históricos'),
('Tecnología', 'Libros sobre programación y tecnología'),
('Biografías', 'Biografías y memorias')
ON DUPLICATE KEY UPDATE name=name;

-- Datos iniciales para libros
INSERT INTO books (title, author, isbn, publication_year, description, available_copies, total_copies, category_id, created_at) VALUES
('Cien años de soledad', 'Gabriel García Márquez', '978-0307474728', 1967, 'Obra maestra del realismo mágico', 5, 5, 1, NOW()),
('1984', 'George Orwell', '978-0451524935', 1949, 'Novela distópica clásica', 3, 5, 1, NOW()),
('Sapiens', 'Yuval Noah Harari', '978-0062316097', 2011, 'Historia de la humanidad', 4, 4, 3, NOW()),
('Clean Code', 'Robert C. Martin', '978-0132350884', 2008, 'Guía para escribir código limpio', 2, 3, 4, NOW()),
('El principito', 'Antoine de Saint-Exupéry', '978-0156012195', 1943, 'Fábula poética y filosófica', 6, 6, 1, NOW()),
('Breve historia del tiempo', 'Stephen Hawking', '978-0553380163', 1988, 'Introducción a la cosmología', 3, 3, 2, NOW())
ON DUPLICATE KEY UPDATE isbn=isbn;