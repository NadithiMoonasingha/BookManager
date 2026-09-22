package com.bookmanager.service;

import com.bookmanager.dto.AuthResponse;
import com.bookmanager.dto.LoginRequest;
import com.bookmanager.dto.SignupRequest;
import com.bookmanager.model.User;
import com.bookmanager.repository.UserRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User signUp(SignupRequest request) {

        // Check if email already exists
        if (userRepository.existsByUserEmail(request.getUserEmail())) {
            throw new RuntimeException(
                    "An account with this email already exists."
            );
        }

        // Only MEMBER and LIBRARIAN can use public signup
        if (!"MEMBER".equals(request.getUserRole()) &&
            !"LIBRARIAN".equals(request.getUserRole())) {

            throw new RuntimeException(
                    "Invalid user role."
            );
        }

        User user = new User();

        user.setUserName(request.getUserName());
        user.setUserEmail(request.getUserEmail());
        user.setUserRole(request.getUserRole());

        // Hash password before saving
        user.setUserPassword(
                passwordEncoder.encode(request.getUserPassword())
        );

        return userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByUserEmail(request.getUserEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password."
                        )
                );

        // Check password
        if (!passwordEncoder.matches(
                request.getUserPassword(),
                user.getUserPassword())) {

            throw new RuntimeException(
                    "Invalid email or password."
            );
        }

        // Generate JWT
        String token = jwtService.generateToken(
                user.getUserId(),
                user.getUserEmail(),
                user.getUserRole()
        );

        return new AuthResponse(
                token,
                user.getUserId(),
                user.getUserName(),
                user.getUserEmail(),
                user.getUserRole()
        );
    }
}