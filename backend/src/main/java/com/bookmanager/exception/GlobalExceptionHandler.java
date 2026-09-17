package com.bookmanager.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateBookTitleException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateBookTitle(
            DuplicateBookTitleException exception) {

        Map<String, String> response = new HashMap<>();

        response.put("message", exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @ExceptionHandler(DuplicateIsbnException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateIsbn(
            DuplicateIsbnException exception) {

        Map<String, String> response = new HashMap<>();

        response.put("message", exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }
}