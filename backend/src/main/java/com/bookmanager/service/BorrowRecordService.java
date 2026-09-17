package com.bookmanager.service;

import com.bookmanager.model.Book;
import com.bookmanager.model.BorrowRecord;

import com.bookmanager.repository.BookRepository;
import com.bookmanager.repository.BorrowRecordRepository;

import com.bookmanager.exception.BookNotFoundException;
import com.bookmanager.exception.NoAvailableCopiesException;
import com.bookmanager.exception.BorrowRecordNotFoundException;
import com.bookmanager.exception.BookNotCurrentlyBorrowedException;
import com.bookmanager.exception.RecordAlreadyVerifiedException;
import com.bookmanager.exception.BookNotAvailableException;
import com.bookmanager.exception.InvalidBorrowRecordStatusException;

import jakarta.transaction.Transactional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BorrowRecordService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;

    public BorrowRecordService(
            BorrowRecordRepository borrowRecordRepository,
            BookRepository bookRepository) {

        this.borrowRecordRepository = borrowRecordRepository;
        this.bookRepository = bookRepository;
    }

    // GET ALL BORROW RECORDS

    public List<BorrowRecord> getVerifiedRecords() {
        return borrowRecordRepository.findAll();
    }

    // GET PENDING VERIFICATION RECORDS

    public List<BorrowRecord> getPendingRecords() {

        return borrowRecordRepository
                .findByVerifiedFalseAndStatusIn(
                        List.of(
                                "PENDING_BORROW",
                                "PENDING_RETURN"
                        )
                );
    }


    // GET RECORD BY ID

    public ResponseEntity<BorrowRecord> getBorrowRecordById(
            Long id) {

        return borrowRecordRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() ->
                        new BorrowRecordNotFoundException(
                                "Borrow record not found with ID: " + id
                        )
                );
    }


    // CREATE BORROW REQUEST

    @Transactional
    public ResponseEntity<?> addBorrowRecord(
            BorrowRecord borrowRecord) {

        // Find selected book

        Book book = bookRepository
                .findById(borrowRecord.getBookId())
                .orElseThrow(() ->
                        new BookNotFoundException(
                                "Book not found with ID: "
                                        + borrowRecord.getBookId()
                        )
                );


        // Check whether copies are available

        if (book.getAvailableCopies() == null ||
                book.getAvailableCopies() <= 0) {

            throw new NoAvailableCopiesException(
                    "No copies available for book: "
                            + borrowRecord.getBookId()
            );
        }


        // Create pending borrow request

        borrowRecord.setStatus("PENDING_BORROW");

        borrowRecord.setVerified(false);

        borrowRecord.setReturnDate(null);


        // Save request

        BorrowRecord savedRecord =
                borrowRecordRepository.saveAndFlush(
                        borrowRecord
                );

        return ResponseEntity.ok(savedRecord);
    }


    // CREATE RETURN REQUEST

    @Transactional
    public ResponseEntity<?> requestReturn(Long id) {

        // Find original borrowing record

        BorrowRecord originalRecord =
                borrowRecordRepository.findById(id)
                        .orElseThrow(() ->
                                new BorrowRecordNotFoundException(
                                        "Borrow record not found with ID: "
                                                + id
                                )
                        );


        // Check whether book is currently borrowed

        if (!"BORROWED".equals(
                originalRecord.getStatus()) ||
                !Boolean.TRUE.equals(
                        originalRecord.getVerified())) {

            throw new BookNotCurrentlyBorrowedException(
                    "This book is not currently borrowed."
            );
        }


        // Change the existing record to pending return

        originalRecord.setStatus("PENDING_RETURN");

        originalRecord.setVerified(false);

        originalRecord.setReturnDate(null);


        // Save return request

        BorrowRecord updatedRecord =
                borrowRecordRepository.saveAndFlush(
                        originalRecord
                );

        return ResponseEntity.ok(updatedRecord);
    }


    // LIBRARIAN VERIFICATION

    @Transactional
    public ResponseEntity<?> verifyRecord(Long id) {

        // Find pending record

        BorrowRecord record =
                borrowRecordRepository.findById(id)
                        .orElseThrow(() ->
                                new BorrowRecordNotFoundException(
                                        "Borrow record not found with ID: "
                                                + id
                                )
                        );


        // Check whether already verified

        if (Boolean.TRUE.equals(
                record.getVerified())) {

            throw new RecordAlreadyVerifiedException(
                    "This record has already been verified."
            );
        }


        // VERIFY BORROW

        if ("PENDING_BORROW".equals(
                record.getStatus())) {

            return verifyBorrow(record);
        }


        // VERIFY RETURN

        if ("PENDING_RETURN".equals(
                record.getStatus())) {

            return verifyReturn(record);
        }


        // Invalid status

        throw new InvalidBorrowRecordStatusException(
                "Invalid borrow record status: "
                        + record.getStatus()
        );
    }


    // VERIFY BORROW

    private ResponseEntity<?> verifyBorrow(
            BorrowRecord record) {

        // Find book

        Book book = bookRepository
                .findById(record.getBookId())
                .orElseThrow(() ->
                        new BookNotFoundException(
                                "Book not found with ID: "
                                        + record.getBookId()
                        )
                );


        // Check availability again

        if (book.getAvailableCopies() == null ||
                book.getAvailableCopies() <= 0) {

            throw new BookNotAvailableException(
                    "No copies are currently available for this book."
            );
        }


        // Decrease available copies

        book.setAvailableCopies(
                book.getAvailableCopies() - 1
        );

        bookRepository.save(book);


        // Update borrow record

        record.setStatus("BORROWED");

        record.setVerified(true);


        BorrowRecord updatedRecord =
                borrowRecordRepository.saveAndFlush(
                        record
                );

        return ResponseEntity.ok(updatedRecord);
    }


    // VERIFY RETURN

    private ResponseEntity<?> verifyReturn(
            BorrowRecord record) {

        // Find book

        Book book = bookRepository
                .findById(record.getBookId())
                .orElseThrow(() ->
                        new BookNotFoundException(
                                "Book not found with ID: "
                                        + record.getBookId()
                        )
                );


        // Get available copies

        Integer availableCopies =
                book.getAvailableCopies();

        if (availableCopies == null) {

            availableCopies = 0;
        }


        // Increase available copies

        book.setAvailableCopies(
                availableCopies + 1
        );

        bookRepository.save(book);


        // Update return record

        record.setStatus("RETURNED");

        record.setVerified(true);

        record.setReturnDate(
                LocalDate.now()
        );


        BorrowRecord updatedRecord =
                borrowRecordRepository.saveAndFlush(
                        record
                );

        return ResponseEntity.ok(updatedRecord);
    }
}