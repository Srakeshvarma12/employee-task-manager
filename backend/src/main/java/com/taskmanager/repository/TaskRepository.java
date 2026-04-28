package com.taskmanager.repository;

import com.taskmanager.model.Task;
import com.taskmanager.model.TaskStatus;
import com.taskmanager.model.TaskPriority;
import com.taskmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByCreatedBy(User user);

    List<Task> findByAssignedTo(User user);

    List<Task> findByStatus(TaskStatus status);

    List<Task> findByPriority(TaskPriority priority);

    List<Task> findByDueDate(LocalDate dueDate);

    List<Task> findByAssignedToAndStatus(User assignedTo, TaskStatus status);

    @Query("SELECT t FROM Task t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:dueDate IS NULL OR t.dueDate = :dueDate) AND " +
           "(:assignedTo IS NULL OR t.assignedTo = :assignedTo)")
    List<Task> findWithFilters(
        @Param("status") TaskStatus status,
        @Param("priority") TaskPriority priority,
        @Param("dueDate") LocalDate dueDate,
        @Param("assignedTo") User assignedTo
    );

    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = :status")
    Long countByStatus(@Param("status") TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t")
    Long countAll();

    @Query("SELECT t.status, COUNT(t) FROM Task t GROUP BY t.status")
    List<Object[]> getTaskCountByStatus();
}