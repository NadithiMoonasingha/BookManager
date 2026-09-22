package com.bookmanager.repository;

import com.bookmanager.model.BorrowRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BorrowRecordRepository
        extends JpaRepository<BorrowRecord, Long> {

    List<BorrowRecord> findByVerifiedTrue();

    List<BorrowRecord> findByVerifiedFalse();

    List<BorrowRecord> findByVerifiedFalseAndStatusIn(
            List<String> statuses
    );

    List<BorrowRecord> findByUserId(Long userId);
}