package com.biblioteca.notification.service;

import com.biblioteca.notification.model.Notification;
import com.biblioteca.notification.model.NotificationStatus;
import com.biblioteca.notification.model.NotificationType;
import com.biblioteca.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final JavaMailSender mailSender;

    @Transactional
    public Notification createNotification(Long userId, String userEmail,
                                           NotificationType type, String subject,
                                           String message, Long loanId, Long bookId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setUserEmail(userEmail);
        notification.setType(type);
        notification.setSubject(subject);
        notification.setMessage(message);
        notification.setLoanId(loanId);
        notification.setBookId(bookId);
        notification.setStatus(NotificationStatus.PENDING);

        return notificationRepository.save(notification);
    }

    @Transactional
    public void sendNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(notification.getUserEmail());
            message.setSubject(notification.getSubject());
            message.setText(notification.getMessage());
            message.setFrom("noreply@biblioteca.com");

            mailSender.send(message);

            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            log.info("Notification sent successfully to: {}", notification.getUserEmail());

        } catch (Exception e) {
            notification.setStatus(NotificationStatus.FAILED);
            log.error("Failed to send notification: {}", e.getMessage());
        }

        notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getPendingNotifications() {
        return notificationRepository.findByStatus(NotificationStatus.PENDING);
    }



    @Transactional
    public void sendPendingNotifications() {
        List<Notification> pending = getPendingNotifications();
        log.info("Sending {} pending notifications", pending.size());

        pending.forEach(notification -> sendNotification(notification.getId()));
    }

    public List<LoanDTO> fetchActiveLoans() {
        ResponseEntity<List<LoanDTO>> response = restTemplate.exchange(
                "http://loan-service/api/loans/active",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<LoanDTO>>() {}
        );
        return response.getBody();
    }
}