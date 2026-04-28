package com.taskmanager.service;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.dto.TaskSummary;
import com.taskmanager.model.*;
import com.taskmanager.repository.TaskHistoryRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskHistoryRepository taskHistoryRepository;

    public List<TaskResponse> getAllTasks(TaskStatus status, TaskPriority priority,
                                         java.time.LocalDate dueDate, Long assignedToId) {
        User assignedTo = null;
        if (assignedToId != null) {
            assignedTo = userRepository.findById(assignedToId).orElse(null);
        }

        List<Task> tasks = taskRepository.findWithFilters(status, priority, dueDate, assignedTo);

        return tasks.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        return mapToResponse(task);
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request, Long userId) {
        User creator = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        User assignedTo = null;
        if (request.getAssignedTo() != null) {
            assignedTo = userRepository.findById(request.getAssignedTo())
                .orElseThrow(() -> new RuntimeException("Assigned user not found"));
        }

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM);
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO);
        task.setDueDate(request.getDueDate());
        task.setCreatedBy(creator);
        task.setAssignedTo(assignedTo);

        Task savedTask = taskRepository.save(task);

        // Create initial history entry
        createHistory(savedTask, creator, null, savedTask.getStatus().name());

        return mapToResponse(savedTask);
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request, Long userId) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found"));

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getStatus() != null && !request.getStatus().equals(task.getStatus())) {
            createHistory(task, user, task.getStatus().name(), request.getStatus().name());
            task.setStatus(request.getStatus());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        if (request.getAssignedTo() != null) {
            User assignedTo = userRepository.findById(request.getAssignedTo())
                .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            task.setAssignedTo(assignedTo);
        }

        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long id, TaskStatus newStatus, Long userId) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found"));

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        TaskStatus oldStatus = task.getStatus();
        task.setStatus(newStatus);

        createHistory(task, user, oldStatus.name(), newStatus.name());

        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    @Transactional
    public void deleteTask(Long id, Long userId) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getCreatedBy().getId().equals(userId)) {
            throw new RuntimeException("Only the task creator can delete the task");
        }

        taskRepository.delete(task);
    }

    public TaskSummary getTaskSummary() {
        Long total = taskRepository.countAll();
        Long todo = taskRepository.countByStatus(TaskStatus.TODO);
        Long inProgress = taskRepository.countByStatus(TaskStatus.IN_PROGRESS);
        Long done = taskRepository.countByStatus(TaskStatus.DONE);

        return new TaskSummary(total, todo, inProgress, done);
    }

    private void createHistory(Task task, User changedBy, String oldStatus, String newStatus) {
        TaskHistory history = new TaskHistory();
        history.setTask(task);
        history.setChangedBy(changedBy);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        taskHistoryRepository.save(history);
    }

    private TaskResponse mapToResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setPriority(task.getPriority());
        response.setDueDate(task.getDueDate());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());

        if (task.getCreatedBy() != null) {
            response.setCreatedById(task.getCreatedBy().getId());
            response.setCreatedByName(task.getCreatedBy().getName());
        }

        if (task.getAssignedTo() != null) {
            response.setAssignedToId(task.getAssignedTo().getId());
            response.setAssignedToName(task.getAssignedTo().getName());
        }

        return response;
    }
}