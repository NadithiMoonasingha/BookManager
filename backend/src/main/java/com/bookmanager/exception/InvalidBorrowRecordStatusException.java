package com.bookmanager.exception;
public class InvalidBorrowRecordStatusException extends RuntimeException {

    public InvalidBorrowRecordStatusException(String message) {
        super(message);
    }
}