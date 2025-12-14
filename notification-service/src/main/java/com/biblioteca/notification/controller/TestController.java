package com.biblioteca.notification.controller;

import com.biblioteca.notification.model.NotificationType;
import com.biblioteca.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final NotificationService notificationService;

    /**
     * Endpoint para probar el envío de notificaciones
     * Accede desde el navegador: http://localhost:8084/api/test/send-email
     */
    @GetMapping("/send-email")
    public ResponseEntity<Map<String, String>> sendTestEmail() {
        try {
            // Crear una notificación de prueba
            var notification = notificationService.createNotification(
                    1L,                                    // userId
                    "test@example.com",                    // email de prueba
                    NotificationType.LOAN_CONFIRMATION,    // tipo
                    "🎉 Prueba de Notificación",          // asunto
                    "Este es un email de prueba desde el servicio de notificaciones. " +
                            "Si ves esto en Mailtrap, ¡todo está funcionando correctamente! 🚀", // mensaje
                    123L,                                  // loanId
                    456L                                   // bookId
            );

            // Enviar inmediatamente
            notificationService.sendNotification(notification.getId());

            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Email enviado a Mailtrap! Ve a https://mailtrap.io para verlo");
            response.put("notificationId", notification.getId().toString());
            response.put("recipient", notification.getUserEmail());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}