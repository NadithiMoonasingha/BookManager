package com.bookmanager.exception;
public class BorrowRecordNotFoundException extends RuntimeException {
    public BorrowRecordNotFoundException(String message) {
      super(message);
    }
}
