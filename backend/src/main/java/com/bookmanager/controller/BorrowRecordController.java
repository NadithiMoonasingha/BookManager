package com.bookmanager.controller;

import com.bookmanager.model.BorrowRecord;
import com.bookmanager.service.BorrowRecordService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow-records")
@CrossOrigin(origins = "http://localhost:5173")
public class BorrowRecordController {

    private final BorrowRecordService borrowRecordService;

    public BorrowRecordController(
            BorrowRecordService borrowRecordService) {

        this.borrowRecordService = borrowRecordService;
    }


    // GET CURRENTLY BORROWED RECORDS

    @GetMapping
    public List<BorrowRecord> getVerifiedRecords() {

        return borrowRecordService.getVerifiedRecords();
    }


    // GET PENDING VERIFICATION RECORDS

    @GetMapping("/pending")
    public List<BorrowRecord> getPendingRecords() {

        return borrowRecordService.getPendingRecords();
    }


    // GET RECORD BY ID

    @GetMapping("/{id}")
    public ResponseEntity<BorrowRecord> getBorrowRecordById(
            @PathVariable Long id) {

        return borrowRecordService.getBorrowRecordById(id);
    }


    // CREATE BORROW REQUEST

    @PostMapping
    public ResponseEntity<?> addBorrowRecord(
            @RequestBody BorrowRecord borrowRecord) {

        return borrowRecordService
                .addBorrowRecord(borrowRecord);
    }


    // CREATE RETURN REQUEST

    @PostMapping("/{id}/return")
    public ResponseEntity<?> requestReturn(
            @PathVariable Long id) {

        return borrowRecordService
                .requestReturn(id);
    }


    // LIBRARIAN VERIFICATION

    @PutMapping("/{id}/verify")
    public ResponseEntity<?> verifyRecord(
            @PathVariable Long id) {

        return borrowRecordService
                .verifyRecord(id);
    }
}