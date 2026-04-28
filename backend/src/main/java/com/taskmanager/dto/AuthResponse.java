package com.taskmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String message;
    private Long userId;
    private String userName;
    private String userEmail;

    public AuthResponse(String token, String message, Long userId, String userName, String userEmail) {
        this.token = token;
        this.message = message;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
    }
}