package com.rahul.studentcourseenrollmentsystem.controller;

import com.rahul.studentcourseenrollmentsystem.dto.AuthResponse;
import com.rahul.studentcourseenrollmentsystem.dto.LoginRequest;
import com.rahul.studentcourseenrollmentsystem.dto.RegisterRequest;
import com.rahul.studentcourseenrollmentsystem.entity.User;
import com.rahul.studentcourseenrollmentsystem.repository.UserRepository;
import com.rahul.studentcourseenrollmentsystem.security.JwtService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:5176",
                "http://localhost:5177",
                "http://localhost:5178",
                "http://localhost:5179",
                "http://localhost:5180"
        }
)
public class AuthController {


    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {

        this.authenticationManager =
                authenticationManager;

        this.jwtService =
                jwtService;

        this.userRepository =
                userRepository;

        this.passwordEncoder =
                passwordEncoder;
    }


    // =========================================================
    // REGISTER
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request
    ) {


        // -------------------------------------------------------
        // CHECK REQUEST
        // -------------------------------------------------------

        if (request == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Request body is required"
                    );
        }


        // -------------------------------------------------------
        // CHECK EMAIL
        // -------------------------------------------------------

        if (request.getEmail() == null ||
                request.getEmail()
                        .trim()
                        .isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Email is required"
                    );
        }


        // -------------------------------------------------------
        // CHECK PASSWORD
        // -------------------------------------------------------

        if (request.getPassword() == null ||
                request.getPassword()
                        .trim()
                        .isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Password is required"
                    );
        }


        // -------------------------------------------------------
        // CLEAN EMAIL
        // -------------------------------------------------------

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        // -------------------------------------------------------
        // CHECK EXISTING USER
        // -------------------------------------------------------

        if (userRepository
                .findByEmail(email)
                .isPresent()) {

            return ResponseEntity
                    .status(
                            HttpStatus.CONFLICT
                    )
                    .body(
                            "Email already registered"
                    );
        }


        // -------------------------------------------------------
        // ROLE
        // -------------------------------------------------------

        String role =
                request.getRole();


        if (role == null ||
                role.trim().isEmpty()) {

            role = "STUDENT";
        }


        role =
                role.trim()
                        .toUpperCase();


        // -------------------------------------------------------
        // VALIDATE ROLE
        // -------------------------------------------------------

        if (!role.equals("STUDENT") &&
                !role.equals("ADMIN")) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Role must be STUDENT or ADMIN"
                    );
        }


        // -------------------------------------------------------
        // CREATE USER
        // -------------------------------------------------------

        User user =
                new User();


        user.setEmail(email);


        // -------------------------------------------------------
        // ENCRYPT PASSWORD
        // -------------------------------------------------------

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );


        user.setRole(role);


        // -------------------------------------------------------
        // SAVE USER
        // -------------------------------------------------------

        userRepository.save(user);


        // -------------------------------------------------------
        // RESPONSE
        // -------------------------------------------------------

        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(
                        "Registration successful"
                );
    }


    // =========================================================
    // LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {


        // -------------------------------------------------------
        // CHECK REQUEST
        // -------------------------------------------------------

        if (request == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            new AuthResponse(
                                    null,
                                    "Request body is required"
                            )
                    );
        }


        // -------------------------------------------------------
        // CHECK EMAIL
        // -------------------------------------------------------

        if (request.getEmail() == null ||
                request.getEmail()
                        .trim()
                        .isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            new AuthResponse(
                                    null,
                                    "Email is required"
                            )
                    );
        }


        // -------------------------------------------------------
        // CHECK PASSWORD
        // -------------------------------------------------------

        if (request.getPassword() == null ||
                request.getPassword()
                        .isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            new AuthResponse(
                                    null,
                                    "Password is required"
                            )
                    );
        }


        // -------------------------------------------------------
        // CLEAN EMAIL
        // -------------------------------------------------------

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        try {


            // ---------------------------------------------------
            // AUTHENTICATE
            // ---------------------------------------------------

            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    request.getPassword()
                            )
                    );


            // ---------------------------------------------------
            // GENERATE JWT
            // ---------------------------------------------------

            String token =
                    jwtService.generateToken(
                            authentication.getName()
                    );


            // ---------------------------------------------------
            // USER DETAILS
            // ---------------------------------------------------

            User loggedInUser =
                    userRepository
                            .findByEmail(email)
                            .orElse(null);

            String role =
                    loggedInUser != null
                            ? loggedInUser.getRole()
                            : "STUDENT";

            Long userId =
                    loggedInUser != null
                            ? loggedInUser.getId()
                            : null;


            // ---------------------------------------------------
            // SUCCESS
            // ---------------------------------------------------

            return ResponseEntity.ok(
                    new AuthResponse(
                            token,
                            "Login successful",
                            role,
                            email,
                            userId
                    )
            );


        } catch (
                AuthenticationException exception
        ) {


            // ---------------------------------------------------
            // INVALID LOGIN
            // ---------------------------------------------------

            return ResponseEntity
                    .status(
                            HttpStatus.UNAUTHORIZED
                    )
                    .body(
                            new AuthResponse(
                                    null,
                                    "Invalid email or password"
                            )
                    );
        }
    }
}