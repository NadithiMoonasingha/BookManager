package com.bookmanager.controller;

import com.bookmanager.dto.AuthResponse;
import com.bookmanager.dto.LoginRequest;
import com.bookmanager.dto.SignupRequest;
import com.bookmanager.model.User;
import com.bookmanager.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(
            @RequestBody SignupRequest request) {

        try {

            User createdUser =
                    authService.signUp(request);

            return ResponseEntity.ok(createdUser);

        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(exception.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            AuthResponse response =
                    authService.login(request);

            return ResponseEntity.ok(response);

        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(exception.getMessage());
        }
    }
}