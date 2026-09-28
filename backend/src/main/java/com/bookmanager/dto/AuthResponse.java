package com.bookmanager.dto;

public class AuthResponse {

    private String token;
    private Long userId;
    private String userName;
    private String userEmail;
    private String userRole;

    public AuthResponse(
            String token,
            Long userId,
            String userName,
            String userEmail,
            String userRole) {

        this.token = token;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userRole = userRole;
    }

    public String getToken() {
        return token;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getUserRole() {
        return userRole;
    }
}