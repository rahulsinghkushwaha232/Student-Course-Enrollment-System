package com.rahul.studentcourseenrollmentsystem.controller;

import com.rahul.studentcourseenrollmentsystem.entity.Enrollment;
import com.rahul.studentcourseenrollmentsystem.repository.EnrollmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/payments")
@CrossOrigin
public class PaymentController {

    private final EnrollmentRepository enrollmentRepository;

    public PaymentController(
            EnrollmentRepository enrollmentRepository
    ) {
        this.enrollmentRepository =
                enrollmentRepository;
    }


    @PostMapping("/simulate/{enrollmentId}")
    public ResponseEntity<?> simulatePayment(
            @PathVariable Long enrollmentId
    ) {

        try {

            Enrollment enrollment =
                    enrollmentRepository
                            .findById(enrollmentId)
                            .orElse(null);


            if (enrollment == null) {

                Map<String, Object> error =
                        new HashMap<>();

                error.put(
                        "success",
                        false
                );

                error.put(
                        "message",
                        "Enrollment not found."
                );

                return ResponseEntity
                        .status(404)
                        .body(error);
            }


            if (
                    enrollment.getCourse() == null
            ) {

                Map<String, Object> error =
                        new HashMap<>();

                error.put(
                        "success",
                        false
                );

                error.put(
                        "message",
                        "Course not found for this enrollment."
                );

                return ResponseEntity
                        .badRequest()
                        .body(error);
            }


            Double courseFee =
                    enrollment
                            .getCourse()
                            .getFee();


            if (
                    courseFee == null ||
                            courseFee <= 0
            ) {

                Map<String, Object> error =
                        new HashMap<>();

                error.put(
                        "success",
                        false
                );

                error.put(
                        "message",
                        "Course fee must be greater than zero."
                );

                return ResponseEntity
                        .badRequest()
                        .body(error);
            }


            // Generate simulated PhonePe payment ID
            String simulatedPaymentId =
                    "PHONEPE_SIM_"
                            + UUID.randomUUID()
                            .toString()
                            .replace("-", "")
                            .substring(0, 12)
                            .toUpperCase();


            // Update enrollment payment details
            enrollment.setAmountPaid(
                    courseFee
            );

            enrollment.setPaymentStatus(
                    "PAID"
            );

            enrollment.setPaymentId(
                    simulatedPaymentId
            );

            enrollment.setPaymentDate(
                    LocalDate.now()
            );


            Enrollment savedEnrollment =
                    enrollmentRepository
                            .save(enrollment);


            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    true
            );

            response.put(
                    "message",
                    "Simulated PhonePe payment successful."
            );

            response.put(
                    "paymentId",
                    simulatedPaymentId
            );

            response.put(
                    "amount",
                    courseFee
            );

            response.put(
                    "paymentStatus",
                    "PAID"
            );

            response.put(
                    "paymentDate",
                    LocalDate.now()
            );

            response.put(
                    "enrollmentId",
                    savedEnrollment.getId()
            );


            return ResponseEntity.ok(response);


        } catch (Exception error) {

            error.printStackTrace();


            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    "Payment simulation failed."
            );


            return ResponseEntity
                    .status(500)
                    .body(response);
        }
    }
}