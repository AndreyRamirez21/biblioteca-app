-- Datos iniciales para usuarios
INSERT INTO users (email, password, first_name, last_name, phone, role, active, created_at)
VALUES
('admin@library.com', 'password123', 'Admin', 'System', '3001234567', 'ADMIN', true, NOW()),
('juan.perez@email.com', 'password123', 'Juan', 'Pérez', '3009876543', 'USER', true, NOW()),
('maria.garcia@email.com', 'password123', 'María', 'García', '3012345678', 'USER', true, NOW()),
('carlos.lopez@email.com', 'password123', 'Carlos', 'López', '3007654321', 'USER', true, NOW()),
('ana.martinez@email.com', 'password123', 'Ana', 'Martínez', '3015556677', 'USER', true, NOW())
ON DUPLICATE KEY UPDATE email=email;