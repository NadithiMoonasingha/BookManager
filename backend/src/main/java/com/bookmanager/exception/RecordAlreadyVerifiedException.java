package com.bookmanager.exception;
public class RecordAlreadyVerifiedException extends RuntimeException {

    public RecordAlreadyVerifiedException(String message) {
        super(message);
    }
}