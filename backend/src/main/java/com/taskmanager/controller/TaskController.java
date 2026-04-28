package com.taskmanager.controller;

import com.taskmanager.dto.StatusUpdateRequest;
import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.dto.TaskSummary;
import com.taskmanager.model.TaskPriority;
import com.taskmanager.model.TaskStatus;
import com.taskmanager.model.User;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(required = false) java.time.LocalDate dueDate,
            @RequestParam(required = false) Long assignedTo) {
        return ResponseEntity.ok(taskService.getAllTasks(status, priority, dueDate, assignedTo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody TaskRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(taskService.createTask(request, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(taskService.updateTask(id, request, userId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(taskService.updateTaskStatus(id, request.getStatus(), userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        taskService.deleteTask(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<TaskSummary> getTaskSummary() {
        return ResponseEntity.ok(taskService.getTaskSummary());
    }

    private Long getUserIdFromAuthentication(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}