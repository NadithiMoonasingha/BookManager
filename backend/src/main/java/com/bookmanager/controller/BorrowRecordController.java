package com.bookmanager.controller;

import com.bookmanager.model.BorrowRecord;
import com.bookmanager.service.BorrowRecordService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

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

    // =========================================================
    // GET BORROW RECORDS
    // =========================================================

    @GetMapping
    public List<BorrowRecord> getBorrowRecords(
            Authentication authentication) {

        String role = getRole(authentication);

        // Admin and librarian can see all records
        if ("ADMIN".equals(role) ||
                "LIBRARIAN".equals(role)) {

            return borrowRecordService.getAllRecords();
        }

        // Member can see only their own records
        return borrowRecordService.getRecordsForUser(
                authentication.getName()
        );
    }

    // =========================================================
    // GET PENDING VERIFICATION RECORDS
    // =========================================================

    @GetMapping("/pending")
    public List<BorrowRecord> getPendingRecords() {

        return borrowRecordService.getPendingRecords();
    }

    // =========================================================
    // GET RECORD BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<BorrowRecord> getBorrowRecordById(
            @PathVariable Long id,
            Authentication authentication) {

        String role = getRole(authentication);

        return borrowRecordService.getBorrowRecordById(
                id,
                authentication.getName(),
                role
        );
    }

    // =========================================================
    // CREATE BORROW REQUEST
    // =========================================================

    @PostMapping
    public ResponseEntity<?> addBorrowRecord(
            @RequestBody BorrowRecord borrowRecord,
            Authentication authentication) {

        return borrowRecordService.addBorrowRecord(
                borrowRecord,
                authentication.getName()
        );
    }

    // =========================================================
    // CREATE RETURN REQUEST
    // =========================================================

    @PostMapping("/{id}/return")
    public ResponseEntity<?> requestReturn(
            @PathVariable Long id,
            Authentication authentication) {

        return borrowRecordService.requestReturn(
                id,
                authentication.getName()
        );
    }

    // LIBRARIAN VERIFICATION

    @PutMapping("/{id}/verify")
    public ResponseEntity<?> verifyRecord(
            @PathVariable Long id) {

        return borrowRecordService
                .verifyRecord(id);
    }

    // =========================================================
    // GET USER ROLE
    // =========================================================

    private String getRole(
            Authentication authentication) {

        for (GrantedAuthority authority :
                authentication.getAuthorities()) {

            String authorityName =
                    authority.getAuthority();

            if (authorityName.startsWith("ROLE_")) {

                return authorityName.substring(5);
            }
        }

        return "";
    }
}