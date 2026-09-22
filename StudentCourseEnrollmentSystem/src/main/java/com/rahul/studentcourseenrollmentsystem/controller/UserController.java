package com.rahul.studentcourseenrollmentsystem.controller;

import com.rahul.studentcourseenrollmentsystem.entity.User;
import com.rahul.studentcourseenrollmentsystem.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(
        origins = {
                "http://localhost:5177",
                "http://localhost:5176",
                "http://localhost:5173"
        }
)
public class UserController {

    private final UserRepository userRepository;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    // =========================================================
    // GET ALL USERS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        List<UserResponse> response =
                userRepository.findAll()
                        .stream()
                        .map(user ->
                                new UserResponse(
                                        user.getId(),
                                        user.getEmail(),
                                        user.getRole()
                                )
                        )
                        .toList();

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // GET USER BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(
            @PathVariable Long id
    ) {

        return userRepository.findById(id)
                .map(user ->
                        ResponseEntity.ok(
                                new UserResponse(
                                        user.getId(),
                                        user.getEmail(),
                                        user.getRole()
                                )
                        )
                )
                .orElseGet(() ->
                        ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(null)
                );
    }


    // =========================================================
    // UPDATE USER ROLE
    // =========================================================

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateRole(
            @PathVariable Long id,
            @RequestBody RoleRequest request
    ) {

        // Check request
        if (request == null ||
                request.getRole() == null ||
                request.getRole().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Role is required");
        }


        // Clean role
        String role = request.getRole()
                .trim()
                .toUpperCase();


        // Validate role
        if (!role.equals("ADMIN") &&
                !role.equals("STUDENT")) {

            return ResponseEntity
                    .badRequest()
                    .body("Role must be ADMIN or STUDENT");
        }


        // Find user
        User user = userRepository
                .findById(id)
                .orElse(null);


        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }


        // Update role
        user.setRole(role);

        userRepository.save(user);


        return ResponseEntity.ok(
                new UserResponse(
                        user.getId(),
                        user.getEmail(),
                        user.getRole()
                )
        );
    }


    // =========================================================
    // DELETE USER
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id
    ) {

        if (!userRepository.existsById(id)) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }


        userRepository.deleteById(id);


        return ResponseEntity.ok(
                "User deleted successfully"
        );
    }


    // =========================================================
    // USER RESPONSE DTO
    // =========================================================
    // Password intentionally frontend ko nahi bhejna.

    public static class UserResponse {

        private Long id;
        private String email;
        private String role;


        public UserResponse(
                Long id,
                String email,
                String role
        ) {

            this.id = id;
            this.email = email;
            this.role = role;
        }


        public Long getId() {
            return id;
        }


        public String getEmail() {
            return email;
        }


        public String getRole() {
            return role;
        }
    }


    // =========================================================
    // ROLE REQUEST
    // =========================================================

    public static class RoleRequest {

        private String role;


        public RoleRequest() {
        }


        public String getRole() {
            return role;
        }


        public void setRole(String role) {
            this.role = role;
        }
    }

}