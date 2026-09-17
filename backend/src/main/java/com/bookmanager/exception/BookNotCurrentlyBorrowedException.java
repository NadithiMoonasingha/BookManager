package com.bookmanager.exception;
public class BookNotCurrentlyBorrowedException extends RuntimeException {

    public BookNotCurrentlyBorrowedException(String message) {
        super(message);
    }
}