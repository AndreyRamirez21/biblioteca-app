-- Datos iniciales para préstamos
INSERT INTO loans (user_id, book_id, loan_date, due_date, return_date, status, notes, created_at) VALUES
(2, 1, '2024-11-15', '2024-11-29', NULL, 'ACTIVE', 'Primer préstamo', NOW()),
(3, 2, '2024-11-20', '2024-12-04', NULL, 'ACTIVE', NULL, NOW()),
(4, 4, '2024-11-01', '2024-11-15', '2024-11-14', 'RETURNED', 'Devuelto a tiempo', NOW()),
(2, 5, '2024-11-25', '2024-12-09', NULL, 'ACTIVE', NULL, NOW())
ON DUPLICATE KEY UPDATE user_id=user_id;