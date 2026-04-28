package com.taskmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskSummary {

    private Long totalTasks;
    private Long todoTasks;
    private Long inProgressTasks;
    private Long completedTasks;
}