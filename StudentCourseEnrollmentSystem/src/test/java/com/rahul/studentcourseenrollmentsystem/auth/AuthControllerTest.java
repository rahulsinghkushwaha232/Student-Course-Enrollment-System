package com.rahul.studentcourseenrollmentsystem.auth;

import com.rahul.studentcourseenrollmentsystem.controller.AuthController;
import com.rahul.studentcourseenrollmentsystem.dto.AuthResponse;
import com.rahul.studentcourseenrollmentsystem.dto.LoginRequest;
import com.rahul.studentcourseenrollmentsystem.dto.RegisterRequest;
import com.rahul.studentcourseenrollmentsystem.entity.User;
import com.rahul.studentcourseenrollmentsystem.repository.UserRepository;
import com.rahul.studentcourseenrollmentsystem.security.JwtService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    // =========================================================
    // MOCK DEPENDENCIES
    // =========================================================

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private Authentication authentication;


    // =========================================================
    // CONTROLLER
    // =========================================================

    private AuthController authController;


    // =========================================================
    // SETUP
    // =========================================================

    @BeforeEach
    void setUp() {

        authController =
                new AuthController(
                        authenticationManager,
                        jwtService,
                        userRepository,
                        passwordEncoder
                );
    }


    // =========================================================
    // REGISTER TEST
    // =========================================================

    @Test
    void register_shouldRegisterUserSuccessfully() {

        RegisterRequest request =
                new RegisterRequest();

        request.setEmail(
                "test@gmail.com"
        );

        request.setPassword(
                "password123"
        );

        request.setRole(
                "STUDENT"
        );


        when(
                userRepository.findByEmail(
                        "test@gmail.com"
                )
        )
                .thenReturn(
                        Optional.empty()
                );


        when(
                passwordEncoder.encode(
                        "password123"
                )
        )
                .thenReturn(
                        "encoded-password"
                );


        ResponseEntity<?> response =
                authController.register(
                        request
                );


        assertEquals(
                HttpStatus.CREATED,
                response.getStatusCode()
        );

        assertEquals(
                "Registration successful",
                response.getBody()
        );


        verify(
                userRepository,
                times(1)
        )
                .save(
                        any(User.class)
                );


        verify(
                passwordEncoder,
                times(1)
        )
                .encode(
                        "password123"
                );
    }


    // =========================================================
    // REGISTER - EMAIL ALREADY EXISTS
    // =========================================================

    @Test
    void register_shouldRejectExistingEmail() {

        RegisterRequest request =
                new RegisterRequest();

        request.setEmail(
                "existing@gmail.com"
        );

        request.setPassword(
                "password123"
        );

        request.setRole(
                "STUDENT"
        );


        User existingUser =
                new User();

        existingUser.setEmail(
                "existing@gmail.com"
        );


        when(
                userRepository.findByEmail(
                        "existing@gmail.com"
                )
        )
                .thenReturn(
                        Optional.of(existingUser)
                );


        ResponseEntity<?> response =
                authController.register(
                        request
                );


        assertEquals(
                HttpStatus.CONFLICT,
                response.getStatusCode()
        );

        assertEquals(
                "Email already registered",
                response.getBody()
        );


        verify(
                userRepository,
                never()
        )
                .save(
                        any(User.class)
                );


        verify(
                passwordEncoder,
                never()
        )
                .encode(
                        anyString()
                );
    }


    // =========================================================
    // REGISTER - EMAIL REQUIRED
    // =========================================================

    @Test
    void register_shouldRejectMissingEmail() {

        RegisterRequest request =
                new RegisterRequest();

        request.setEmail("");

        request.setPassword(
                "password123"
        );

        request.setRole(
                "STUDENT"
        );


        ResponseEntity<?> response =
                authController.register(
                        request
                );


        assertEquals(
                HttpStatus.BAD_REQUEST,
                response.getStatusCode()
        );

        assertEquals(
                "Email is required",
                response.getBody()
        );


        verify(
                userRepository,
                never()
        )
                .save(
                        any(User.class)
                );
    }


    // =========================================================
    // REGISTER - PASSWORD REQUIRED
    // =========================================================

    @Test
    void register_shouldRejectMissingPassword() {

        RegisterRequest request =
                new RegisterRequest();

        request.setEmail(
                "test@gmail.com"
        );

        request.setPassword("");

        request.setRole(
                "STUDENT"
        );


        ResponseEntity<?> response =
                authController.register(
                        request
                );


        assertEquals(
                HttpStatus.BAD_REQUEST,
                response.getStatusCode()
        );

        assertEquals(
                "Password is required",
                response.getBody()
        );


        verify(
                userRepository,
                never()
        )
                .save(
                        any(User.class)
                );
    }


    // =========================================================
    // REGISTER - INVALID ROLE
    // =========================================================

    @Test
    void register_shouldRejectInvalidRole() {

        RegisterRequest request =
                new RegisterRequest();

        request.setEmail(
                "test@gmail.com"
        );

        request.setPassword(
                "password123"
        );

        request.setRole(
                "TEACHER"
        );


        when(
                userRepository.findByEmail(
                        "test@gmail.com"
                )
        )
                .thenReturn(
                        Optional.empty()
                );


        ResponseEntity<?> response =
                authController.register(
                        request
                );


        assertEquals(
                HttpStatus.BAD_REQUEST,
                response.getStatusCode()
        );

        assertEquals(
                "Role must be STUDENT or ADMIN",
                response.getBody()
        );


        verify(
                userRepository,
                never()
        )
                .save(
                        any(User.class)
                );
    }


    // =========================================================
    // REGISTER - DEFAULT ROLE
    // =========================================================

    @Test
    void register_shouldUseStudentRoleByDefault() {

        RegisterRequest request =
                new RegisterRequest();

        request.setEmail(
                "default@gmail.com"
        );

        request.setPassword(
                "password123"
        );

        request.setRole(null);


        when(
                userRepository.findByEmail(
                        "default@gmail.com"
                )
        )
                .thenReturn(
                        Optional.empty()
                );


        when(
                passwordEncoder.encode(
                        "password123"
                )
        )
                .thenReturn(
                        "encoded-password"
                );


        ResponseEntity<?> response =
                authController.register(
                        request
                );


        assertEquals(
                HttpStatus.CREATED,
                response.getStatusCode()
        );


        ArgumentCaptor<User> userCaptor =
                ArgumentCaptor.forClass(
                        User.class
                );


        verify(
                userRepository
        )
                .save(
                        userCaptor.capture()
                );


        User savedUser =
                userCaptor.getValue();


        assertEquals(
                "default@gmail.com",
                savedUser.getEmail()
        );

        assertEquals(
                "STUDENT",
                savedUser.getRole()
        );

        assertEquals(
                "encoded-password",
                savedUser.getPassword()
        );
    }


    // =========================================================
    // LOGIN SUCCESS
    // =========================================================

    @Test
    void login_shouldLoginSuccessfully() {

        LoginRequest request =
                new LoginRequest();

        request.setEmail(
                "test@gmail.com"
        );

        request.setPassword(
                "password123"
        );


        when(
                authenticationManager.authenticate(
                        any(
                                UsernamePasswordAuthenticationToken.class
                        )
                )
        )
                .thenReturn(
                        authentication
                );


        when(
                authentication.getName()
        )
                .thenReturn(
                        "test@gmail.com"
                );


        when(
                jwtService.generateToken(
                        "test@gmail.com"
                )
        )
                .thenReturn(
                        "test-jwt-token"
                );


        ResponseEntity<?> response =
                authController.login(
                        request
                );


        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );


        assertNotNull(
                response.getBody()
        );


        assertInstanceOf(
                AuthResponse.class,
                response.getBody()
        );


        verify(
                authenticationManager,
                times(1)
        )
                .authenticate(
                        any(
                                UsernamePasswordAuthenticationToken.class
                        )
                );


        verify(
                jwtService,
                times(1)
        )
                .generateToken(
                        "test@gmail.com"
                );
    }


    // =========================================================
    // LOGIN - INVALID CREDENTIALS
    // =========================================================

    @Test
    void login_shouldRejectInvalidCredentials() {

        LoginRequest request =
                new LoginRequest();

        request.setEmail(
                "wrong@gmail.com"
        );

        request.setPassword(
                "wrongpassword"
        );


        when(
                authenticationManager.authenticate(
                        any(
                                UsernamePasswordAuthenticationToken.class
                        )
                )
        )
                .thenThrow(
                        new BadCredentialsException(
                                "Invalid credentials"
                        )
                );


        ResponseEntity<?> response =
                authController.login(
                        request
                );


        assertEquals(
                HttpStatus.UNAUTHORIZED,
                response.getStatusCode()
        );


        assertNotNull(
                response.getBody()
        );


        assertInstanceOf(
                AuthResponse.class,
                response.getBody()
        );


        verify(
                authenticationManager,
                times(1)
        )
                .authenticate(
                        any(
                                UsernamePasswordAuthenticationToken.class
                        )
                );


        verify(
                jwtService,
                never()
        )
                .generateToken(
                        anyString()
                );
    }


    // =========================================================
    // LOGIN - EMAIL REQUIRED
    // =========================================================

    @Test
    void login_shouldRejectMissingEmail() {

        LoginRequest request =
                new LoginRequest();

        request.setEmail("");

        request.setPassword(
                "password123"
        );


        ResponseEntity<?> response =
                authController.login(
                        request
                );


        assertEquals(
                HttpStatus.BAD_REQUEST,
                response.getStatusCode()
        );


        assertNotNull(
                response.getBody()
        );


        verify(
                authenticationManager,
                never()
        )
                .authenticate(
                        any(
                                UsernamePasswordAuthenticationToken.class
                        )
                );
    }


    // =========================================================
    // LOGIN - PASSWORD REQUIRED
    // =========================================================

    @Test
    void login_shouldRejectMissingPassword() {

        LoginRequest request =
                new LoginRequest();

        request.setEmail(
                "test@gmail.com"
        );

        request.setPassword("");


        ResponseEntity<?> response =
                authController.login(
                        request
                );


        assertEquals(
                HttpStatus.BAD_REQUEST,
                response.getStatusCode()
        );


        assertNotNull(
                response.getBody()
        );


        verify(
                authenticationManager,
                never()
        )
                .authenticate(
                        any(
                                UsernamePasswordAuthenticationToken.class
                        )
                );
    }
}