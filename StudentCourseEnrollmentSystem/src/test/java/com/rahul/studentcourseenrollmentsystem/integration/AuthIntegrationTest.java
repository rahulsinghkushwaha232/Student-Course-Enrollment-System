package com.rahul.studentcourseenrollmentsystem.integration;
import com.rahul.studentcourseenrollmentsystem.repository.UserRepository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rahul.studentcourseenrollmentsystem.dto.LoginRequest;
import com.rahul.studentcourseenrollmentsystem.dto.RegisterRequest;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
class AuthIntegrationTest {


    // =========================================================
    // MOCK MVC
    // =========================================================

    @Autowired
    private MockMvc mockMvc;


    // =========================================================
    // OBJECT MAPPER
    // =========================================================

    @Autowired
    private ObjectMapper objectMapper;


    // =========================================================
    // USER REPOSITORY
    // =========================================================

    @Autowired
    private UserRepository userRepository;


    // =========================================================
    // CLEAN DATABASE BEFORE EACH TEST
    // =========================================================

    @BeforeEach
    void setUp() {

        userRepository.deleteAll();
    }


    // =========================================================
    // REGISTER USER
    // =========================================================

    @Test
    void registerUser_shouldReturnCreated() throws Exception {

        RegisterRequest request =
                new RegisterRequest();

        request.setEmail(
                "integration@gmail.com"
        );

        request.setPassword(
                "password123"
        );

        request.setRole(
                "STUDENT"
        );


        mockMvc.perform(
                        post("/auth/register")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper.writeValueAsString(
                                                request
                                        )
                                )
                )
                .andExpect(
                        status().isCreated()
                );
    }


    // =========================================================
    // REGISTER DUPLICATE USER
    // =========================================================

    @Test
    void registerDuplicateUser_shouldReturnConflict()
            throws Exception {

        RegisterRequest request =
                new RegisterRequest();

        request.setEmail(
                "duplicate@gmail.com"
        );

        request.setPassword(
                "password123"
        );

        request.setRole(
                "STUDENT"
        );


        // -----------------------------------------------------
        // FIRST REGISTRATION
        // -----------------------------------------------------

        mockMvc.perform(
                        post("/auth/register")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper.writeValueAsString(
                                                request
                                        )
                                )
                )
                .andExpect(
                        status().isCreated()
                );


        // -----------------------------------------------------
        // SECOND REGISTRATION
        // -----------------------------------------------------

        mockMvc.perform(
                        post("/auth/register")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper.writeValueAsString(
                                                request
                                        )
                                )
                )
                .andExpect(
                        status().isConflict()
                );
    }


    // =========================================================
    // LOGIN SUCCESS
    // =========================================================

    @Test
    void loginUser_shouldReturnSuccessAndToken()
            throws Exception {


        // -----------------------------------------------------
        // REGISTER USER FIRST
        // -----------------------------------------------------

        RegisterRequest registerRequest =
                new RegisterRequest();

        registerRequest.setEmail(
                "login@gmail.com"
        );

        registerRequest.setPassword(
                "password123"
        );

        registerRequest.setRole(
                "STUDENT"
        );


        mockMvc.perform(
                        post("/auth/register")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper.writeValueAsString(
                                                registerRequest
                                        )
                                )
                )
                .andExpect(
                        status().isCreated()
                );


        // -----------------------------------------------------
        // LOGIN REQUEST
        // -----------------------------------------------------

        LoginRequest loginRequest =
                new LoginRequest();

        loginRequest.setEmail(
                "login@gmail.com"
        );

        loginRequest.setPassword(
                "password123"
        );


        // -----------------------------------------------------
        // LOGIN
        // -----------------------------------------------------

        mockMvc.perform(
                        post("/auth/login")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper.writeValueAsString(
                                                loginRequest
                                        )
                                )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.token")
                                .exists()
                );
    }


    // =========================================================
    // LOGIN INVALID PASSWORD
    // =========================================================

    @Test
    void loginWithWrongPassword_shouldReturnUnauthorized()
            throws Exception {


        // -----------------------------------------------------
        // REGISTER USER
        // -----------------------------------------------------

        RegisterRequest registerRequest =
                new RegisterRequest();

        registerRequest.setEmail(
                "wrongpassword@gmail.com"
        );

        registerRequest.setPassword(
                "password123"
        );

        registerRequest.setRole(
                "STUDENT"
        );


        mockMvc.perform(
                        post("/auth/register")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper.writeValueAsString(
                                                registerRequest
                                        )
                                )
                )
                .andExpect(
                        status().isCreated()
                );


        // -----------------------------------------------------
        // WRONG PASSWORD
        // -----------------------------------------------------

        LoginRequest loginRequest =
                new LoginRequest();

        loginRequest.setEmail(
                "wrongpassword@gmail.com"
        );

        loginRequest.setPassword(
                "wrongpassword"
        );


        mockMvc.perform(
                        post("/auth/login")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper.writeValueAsString(
                                                loginRequest
                                        )
                                )
                )
                .andExpect(
                        status().isUnauthorized()
                );
    }


    // =========================================================
    // LOGIN WITHOUT EMAIL
    // =========================================================

    @Test
    void loginWithoutEmail_shouldReturnBadRequest()
            throws Exception {

        LoginRequest request =
                new LoginRequest();

        request.setEmail("");

        request.setPassword(
                "password123"
        );


        mockMvc.perform(
                        post("/auth/login")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper.writeValueAsString(
                                                request
                                        )
                                )
                )
                .andExpect(
                        status().isBadRequest()
                );
    }


    // =========================================================
    // REGISTER WITHOUT PASSWORD
    // =========================================================

    @Test
    void registerWithoutPassword_shouldReturnBadRequest()
            throws Exception {

        RegisterRequest request =
                new RegisterRequest();

        request.setEmail(
                "nopassword@gmail.com"
        );

        request.setPassword("");

        request.setRole(
                "STUDENT"
        );


        mockMvc.perform(
                        post("/auth/register")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper.writeValueAsString(
                                                request
                                        )
                                )
                )
                .andExpect(
                        status().isBadRequest()
                );
    }
}