package com.biblioteca.notification.model;

public enum NotificationType {
    LOAN_REMINDER,           // Recordatorio de devolución
    LOAN_OVERDUE,           // Préstamo vencido
    LOAN_CONFIRMATION,      // Confirmación de préstamo
    RETURN_CONFIRMATION,    // Confirmación de devolución
    BOOK_AVAILABLE,         // Libro disponible
    NEW_BOOK_ALERT          // Nuevo libro agregado
}