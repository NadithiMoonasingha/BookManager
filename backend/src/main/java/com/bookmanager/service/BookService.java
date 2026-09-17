package com.bookmanager.service;

import com.bookmanager.model.Book;
import com.bookmanager.repository.BookRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.bookmanager.exception.DuplicateBookTitleException;
import com.bookmanager.exception.DuplicateIsbnException;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    @Autowired
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // Get all books
    public List<Book> getAllBooks() {

        return bookRepository.findAll();
    }

    // Get book by ID
    public ResponseEntity<Book> getBookById(Long id) {

        return bookRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Add book
    public ResponseEntity<?> addBook(Book book) {

        if (bookRepository.existsByBookTitle(book.getBookTitle())) {

        throw new DuplicateBookTitleException(
                "A book with this title already exists."
        );
        }

        if (book.getIsbn() != null &&
                !book.getIsbn().isBlank() &&
                bookRepository.existsByIsbn(book.getIsbn())) {

        throw new DuplicateIsbnException(
                "A book with this ISBN already exists."
        );
        }

        // Check negative values
        if (book.getTotalCopies() == null ||
                book.getAvailableCopies() == null ||
                book.getTotalCopies() < 0 ||
                book.getAvailableCopies() < 0) {

            return ResponseEntity
                    .badRequest()
                    .body("Copies cannot be negative.");
        }

        // Available copies cannot exceed total copies
        if (book.getAvailableCopies() >
                book.getTotalCopies()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Available copies cannot be greater than total copies."
                    );
        }

        Book savedBook =
                bookRepository.save(book);

        return ResponseEntity.ok(savedBook);
    }

    // Update book
    public ResponseEntity<?> updateBook(
            Long id,
            Book book) {

        // Check negative values
        if (book.getTotalCopies() == null ||
                book.getAvailableCopies() == null ||
                book.getTotalCopies() < 0 ||
                book.getAvailableCopies() < 0) {

            return ResponseEntity
                    .badRequest()
                    .body("Copies cannot be negative.");
        }

        // Available copies cannot exceed total copies
        if (book.getAvailableCopies() >
                book.getTotalCopies()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Available copies cannot be greater than total copies."
                    );
        }

        return bookRepository.findById(id)
                .map(existingBook -> {

                    existingBook.setBookTitle(
                            book.getBookTitle()
                    );

                    existingBook.setAuthorName(
                            book.getAuthorName()
                    );

                    existingBook.setIsbn(
                            book.getIsbn()
                    );

                    existingBook.setCategory(
                            book.getCategory()
                    );

                    existingBook.setLanguage(
                            book.getLanguage()
                    );

                    existingBook.setCountry(
                            book.getCountry()
                    );

                    existingBook.setPublication(
                            book.getPublication()
                    );

                    existingBook.setPublicationDate(
                            book.getPublicationDate()
                    );

                    existingBook.setDescription(
                            book.getDescription()
                    );

                    existingBook.setTotalCopies(
                            book.getTotalCopies()
                    );

                    existingBook.setAvailableCopies(
                            book.getAvailableCopies()
                    );

                    Book updatedBook =
                            bookRepository.save(existingBook);

                    return ResponseEntity.ok(updatedBook);

                })
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    // Delete book
    public ResponseEntity<Void> deleteBook(Long id) {

        if (!bookRepository.existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        bookRepository.deleteById(id);

        return ResponseEntity
                .ok()
                .build();
    }
}