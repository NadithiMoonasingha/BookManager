package com.bookmanager.service;

import com.bookmanager.model.Book;
import com.bookmanager.model.BorrowRecord;
import com.bookmanager.model.User;

import com.bookmanager.repository.BookRepository;
import com.bookmanager.repository.BorrowRecordRepository;
import com.bookmanager.repository.UserRepository;

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
    private final UserRepository userRepository;

    public BorrowRecordService(
            BorrowRecordRepository borrowRecordRepository,
            BookRepository bookRepository,
            UserRepository userRepository) {

        this.borrowRecordRepository = borrowRecordRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // GET ALL BORROW RECORDS
    // ADMIN / LIBRARIAN
    // =========================================================

    public List<BorrowRecord> getAllRecords() {
        return borrowRecordRepository.findAll();
    }

    // =========================================================
    // GET MEMBER'S OWN BORROW RECORDS
    // =========================================================

    public List<BorrowRecord> getRecordsForUser(String email) {

        User user = userRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found.")
                );

        return borrowRecordRepository.findByUserId(
                user.getUserId()
        );
    }

    // =========================================================
    // GET PENDING VERIFICATION RECORDS
    // LIBRARIAN
    // =========================================================

    public List<BorrowRecord> getPendingRecords() {

        return borrowRecordRepository
                .findByVerifiedFalseAndStatusIn(
                        List.of(
                                "PENDING_BORROW",
                                "PENDING_RETURN"
                        )
                );
    }

    // =========================================================
    // GET RECORD BY ID
    // =========================================================

    public ResponseEntity<BorrowRecord> getBorrowRecordById(
            Long id,
            String email,
            String role) {

        BorrowRecord record = borrowRecordRepository
                .findById(id)
                .orElseThrow(() ->
                        new BorrowRecordNotFoundException(
                                "Borrow record not found with ID: " + id
                        )
                );

        // Members can only view their own records
        if ("MEMBER".equals(role)) {

            User user = userRepository
                    .findByUserEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException("User not found.")
                    );

            if (!user.getUserId().equals(record.getUserId())) {

                throw new RuntimeException(
                        "You are not authorized to view this record."
                );
            }
        }

        return ResponseEntity.ok(record);
    }

    // =========================================================
    // CREATE BORROW REQUEST
    // MEMBER
    // =========================================================

    @Transactional
    public ResponseEntity<?> addBorrowRecord(
            BorrowRecord borrowRecord,
            String email) {

        // Get the logged-in member from the JWT email
        User user = userRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found.")
                );

        Book book = bookRepository
                .findById(borrowRecord.getBookId())
                .orElseThrow(() ->
                        new BookNotFoundException(
                                "Book not found with ID: "
                                        + borrowRecord.getBookId()
                        )
                );

        if (book.getAvailableCopies() == null ||
                book.getAvailableCopies() <= 0) {

            throw new NoAvailableCopiesException(
                    "No copies available for book: "
                            + borrowRecord.getBookId()
            );
        }

        // IMPORTANT:
        // Do not trust userId/userName sent by the frontend.
        // Set them using the authenticated user.
        borrowRecord.setUserId(user.getUserId());
        borrowRecord.setUserName(user.getUserName());

        // Get the book title from the database as well
        borrowRecord.setBookTitle(book.getBookTitle());

        borrowRecord.setStatus("PENDING_BORROW");
        borrowRecord.setVerified(false);
        borrowRecord.setReturnDate(null);

        BorrowRecord savedRecord =
                borrowRecordRepository.saveAndFlush(
                        borrowRecord
                );

        return ResponseEntity.ok(savedRecord);
    }

    // =========================================================
    // CREATE RETURN REQUEST
    // MEMBER
    // =========================================================

    @Transactional
    public ResponseEntity<?> requestReturn(
            Long id,
            String email) {

        // Get logged-in member
        User user = userRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found.")
                );

        BorrowRecord originalRecord =
                borrowRecordRepository.findById(id)
                        .orElseThrow(() ->
                                new BorrowRecordNotFoundException(
                                        "Borrow record not found with ID: "
                                                + id
                                )
                        );

        // IMPORTANT:
        // A member can only request return for their own record.
        if (!user.getUserId().equals(
                originalRecord.getUserId())) {

            throw new RuntimeException(
                    "You are not authorized to request the return of this record."
            );
        }

        if (!"BORROWED".equals(
                originalRecord.getStatus()) ||
                !Boolean.TRUE.equals(
                        originalRecord.getVerified())) {

            throw new BookNotCurrentlyBorrowedException(
                    "This book is not currently borrowed."
            );
        }

        originalRecord.setStatus("PENDING_RETURN");
        originalRecord.setVerified(false);
        originalRecord.setReturnDate(null);

        BorrowRecord updatedRecord =
                borrowRecordRepository.saveAndFlush(
                        originalRecord
                );

        return ResponseEntity.ok(updatedRecord);
    }

    // =========================================================
    // LIBRARIAN VERIFICATION
    // =========================================================

    @Transactional
    public ResponseEntity<?> verifyRecord(Long id) {

        BorrowRecord record =
                borrowRecordRepository.findById(id)
                        .orElseThrow(() ->
                                new BorrowRecordNotFoundException(
                                        "Borrow record not found with ID: "
                                                + id
                                )
                        );

        if (Boolean.TRUE.equals(
                record.getVerified())) {

            throw new RecordAlreadyVerifiedException(
                    "This record has already been verified."
            );
        }

        if ("PENDING_BORROW".equals(
                record.getStatus())) {

            return verifyBorrow(record);
        }

        if ("PENDING_RETURN".equals(
                record.getStatus())) {

            return verifyReturn(record);
        }

        throw new InvalidBorrowRecordStatusException(
                "Invalid borrow record status: "
                        + record.getStatus()
        );
    }

    // =========================================================
    // VERIFY BORROW
    // =========================================================

    private ResponseEntity<?> verifyBorrow(
            BorrowRecord record) {

        Book book = bookRepository
                .findById(record.getBookId())
                .orElseThrow(() ->
                        new BookNotFoundException(
                                "Book not found with ID: "
                                        + record.getBookId()
                        )
                );

        if (book.getAvailableCopies() == null ||
                book.getAvailableCopies() <= 0) {

            throw new BookNotAvailableException(
                    "No copies are currently available for this book."
            );
        }

        book.setAvailableCopies(
                book.getAvailableCopies() - 1
        );

        bookRepository.save(book);

        record.setStatus("BORROWED");
        record.setVerified(true);

        BorrowRecord updatedRecord =
                borrowRecordRepository.saveAndFlush(
                        record
                );

        return ResponseEntity.ok(updatedRecord);
    }

    // =========================================================
    // VERIFY RETURN
    // =========================================================

    private ResponseEntity<?> verifyReturn(
            BorrowRecord record) {

        Book book = bookRepository
                .findById(record.getBookId())
                .orElseThrow(() ->
                        new BookNotFoundException(
                                "Book not found with ID: "
                                        + record.getBookId()
                        )
                );

        Integer availableCopies =
                book.getAvailableCopies();

        if (availableCopies == null) {
            availableCopies = 0;
        }

        book.setAvailableCopies(
                availableCopies + 1
        );

        bookRepository.save(book);

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