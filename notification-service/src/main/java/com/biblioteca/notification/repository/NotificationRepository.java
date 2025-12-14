package com.biblioteca.notification.repository;

import com.biblioteca.notification.model.Notification;
import com.biblioteca.notification.model.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserId(Long userId);

    List<Notification> findByStatus(NotificationStatus status);

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
}