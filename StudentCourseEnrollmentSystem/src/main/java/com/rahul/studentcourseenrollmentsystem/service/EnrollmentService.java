package com.rahul.studentcourseenrollmentsystem.service;

import com.rahul.studentcourseenrollmentsystem.dto.EnrollmentRequest;
import com.rahul.studentcourseenrollmentsystem.entity.Course;
import com.rahul.studentcourseenrollmentsystem.entity.Enrollment;
import com.rahul.studentcourseenrollmentsystem.entity.Student;
import com.rahul.studentcourseenrollmentsystem.exception.ResourceNotFoundException;
import com.rahul.studentcourseenrollmentsystem.repository.CourseRepository;
import com.rahul.studentcourseenrollmentsystem.repository.EnrollmentRepository;
import com.rahul.studentcourseenrollmentsystem.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;


    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository) {

        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }


    // =========================================================
    // SAVE ENROLLMENT
    // =========================================================

    public Enrollment saveEnrollment(
            EnrollmentRequest request) {

        Student student =
                studentRepository
                        .findById(request.getStudentId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student not found with id "
                                                + request.getStudentId()
                                )
                        );


        Course course =
                courseRepository
                        .findById(request.getCourseId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Course not found with id "
                                                + request.getCourseId()
                                )
                        );


        Enrollment enrollment =
                new Enrollment();

        enrollment.setStudent(student);

        enrollment.setCourse(course);

        applyRequest(enrollment, request);


        return enrollmentRepository.save(
                enrollment
        );
    }


    // =========================================================
    // GET ALL ENROLLMENTS
    // =========================================================

    public List<Enrollment> getAllEnrollments() {

        return enrollmentRepository.findAll();
    }


    // =========================================================
    // GET ENROLLMENT BY ID
    // =========================================================

    public Enrollment getEnrollmentById(
            Long id) {

        return enrollmentRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Enrollment not found with id "
                                        + id
                        )
                );
    }


    // =========================================================
    // UPDATE ENROLLMENT
    // =========================================================

    public Enrollment updateEnrollment(
            Long id,
            EnrollmentRequest request) {

        Enrollment enrollment =
                enrollmentRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Enrollment not found with id "
                                                + id
                                )
                        );


        Student student =
                studentRepository
                        .findById(request.getStudentId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student not found with id "
                                                + request.getStudentId()
                                )
                        );


        Course course =
                courseRepository
                        .findById(request.getCourseId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Course not found with id "
                                                + request.getCourseId()
                                )
                        );


        enrollment.setStudent(student);

        enrollment.setCourse(course);

        applyRequest(enrollment, request);


        return enrollmentRepository.save(
                enrollment
        );
    }


    // =========================================================
    // DELETE ENROLLMENT
    // =========================================================

    public void deleteEnrollment(
            Long id) {

        Enrollment enrollment =
                enrollmentRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Enrollment not found with id "
                                                + id
                                )
                        );

        enrollmentRepository.delete(
                enrollment
        );
    }


    // =========================================================
    // GET COURSES BY STUDENT
    // =========================================================

    public List<Course> getCoursesByStudentId(
            Long studentId) {

        List<Enrollment> enrollments =
                enrollmentRepository
                        .findByStudentId(studentId);


        return enrollments
                .stream()
                .map(Enrollment::getCourse)
                .collect(Collectors.toList());
    }

    private void applyRequest(Enrollment enrollment, EnrollmentRequest request) {
        enrollment.setEnrollmentDate(request.getEnrollmentDate() != null
                ? request.getEnrollmentDate() : LocalDate.now());
        enrollment.setAmountPaid(request.getAmountPaid() != null ? request.getAmountPaid() : 0.0);
        enrollment.setPaymentStatus(normalizePaymentStatus(request.getPaymentStatus()));
        enrollment.setPaymentId(request.getPaymentId());
        enrollment.setPaymentDate(request.getPaymentDate());
    }

    private String normalizePaymentStatus(String value) {
        if (value == null || value.isBlank()) {
            return "PENDING";
        }
        String status = value.trim().toUpperCase();
        if (!status.equals("PENDING") && !status.equals("PAID") && !status.equals("FAILED")) {
            throw new IllegalArgumentException("Payment status must be PENDING, PAID, or FAILED");
        }
        return status;
    }
}
