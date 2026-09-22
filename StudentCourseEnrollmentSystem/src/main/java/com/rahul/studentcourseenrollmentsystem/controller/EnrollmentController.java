package com.rahul.studentcourseenrollmentsystem.controller;

import com.rahul.studentcourseenrollmentsystem.entity.Enrollment;
import com.rahul.studentcourseenrollmentsystem.service.EnrollmentService;
import com.rahul.studentcourseenrollmentsystem.dto.EnrollmentRequest;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    // ============================
    // SAVE ENROLLMENT
    // ============================

    @PostMapping
    public Enrollment saveEnrollment(
            @RequestBody @Valid EnrollmentRequest request) {

        return enrollmentService.saveEnrollment(request);
    }


    // ============================
    // GET ALL ENROLLMENTS
    // ============================

    @GetMapping
    public List<Enrollment> getAllEnrollments() {

        return enrollmentService.getAllEnrollments();
    }


    // ============================
    // GET ENROLLMENT BY ID
    // ============================

    @GetMapping("/{id}")
    public Enrollment getEnrollmentById(
            @PathVariable Long id) {

        return enrollmentService.getEnrollmentById(id);
    }


    // ============================
    // UPDATE ENROLLMENT
    // ============================

    @PutMapping("/{id}")
    public Enrollment updateEnrollment(
            @PathVariable Long id,
            @RequestBody @Valid EnrollmentRequest request) {

        return enrollmentService.updateEnrollment(id, request);
    }


    // ============================
    // DELETE ENROLLMENT
    // ============================

    @DeleteMapping("/{id}")
    public void deleteEnrollment(
            @PathVariable Long id) {

        enrollmentService.deleteEnrollment(id);
    }
}
