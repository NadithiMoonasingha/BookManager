package com.bookmanager.exception;

public class DuplicateBookTitleException extends RuntimeException {

    public DuplicateBookTitleException(String message) {
        super(message);
    }
}