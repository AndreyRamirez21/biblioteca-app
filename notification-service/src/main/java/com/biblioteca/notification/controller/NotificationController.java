package com.biblioteca.notification.controller;

import com.biblioteca.notification.dto.NotificationRequest;
import com.biblioteca.notification.model.Notification;
import com.biblioteca.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Notification> createNotification(
            @Valid @RequestBody NotificationRequest request) {
        Notification notification = notificationService.createNotification(
                request.getUserId(),
                request.getUserEmail(),
                request.getType(),
                request.getSubject(),
                request.getMessage(),
                request.getLoanId(),
                request.getBookId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(notification);
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<Void> sendNotification(@PathVariable Long id) {
        notificationService.sendNotification(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Notification>> getPendingNotifications() {
        return ResponseEntity.ok(notificationService.getPendingNotifications());
    }

    @PostMapping("/send-pending")
    public ResponseEntity<Void> sendPendingNotifications() {
        notificationService.sendPendingNotifications();
        return ResponseEntity.ok().build();
    }
}