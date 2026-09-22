package com.rahul.studentcourseenrollmentsystem.config;

import com.rahul.studentcourseenrollmentsystem.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
public class SecurityConfig {


    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // =========================================================
    // AUTHENTICATION MANAGER
    // =========================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {

        return authenticationConfiguration
                .getAuthenticationManager();
    }


    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) throws Exception {

        http


                // =================================================
                // CORS
                // =================================================

                .cors(cors -> {
                })


                // =================================================
                // CSRF
                // =================================================

                .csrf(csrf ->
                        csrf.disable()
                )


                // =================================================
                // SESSION MANAGEMENT
                // =================================================
                // JWT based authentication ke liye
                // server-side session nahi banega.

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // =================================================
                // AUTHORIZATION
                // =================================================

                .authorizeHttpRequests(auth ->
                        auth


                                // =================================================
                                // CORS PREFLIGHT
                                // =================================================

                                .requestMatchers(
                                        HttpMethod.OPTIONS,
                                        "/**"
                                )
                                .permitAll()


                                // =================================================
                                // LOGIN + REGISTER
                                // =================================================
                                // Login aur registration public hain.

                                .requestMatchers(
                                        "/auth/**"
                                )
                                .permitAll()


                                // =================================================
                                // UPLOADS / STATIC MEDIA
                                // =================================================
                                // Static images such as profile pictures

                                .requestMatchers(
                                        "/uploads/**"
                                )
                                .permitAll()


                                // =================================================
                                // REACT SINGLE-PAGE APP
                                // =================================================
                                // The production React build is served by this
                                // Spring Boot service. Keep the entry page and
                                // compiled assets public; API endpoints remain
                                // protected by their explicit rules below.

                                .requestMatchers(
                                        "/",
                                        "/index.html",
                                        "/assets/**",
                                        "/favicon.svg",
                                        "/icons.svg"
                                )
                                .permitAll()


                                // =================================================
                                // SWAGGER
                                // =================================================

                                .requestMatchers(
                                        "/swagger-ui/**",
                                        "/swagger-ui.html",
                                        "/v3/api-docs/**"
                                )
                                .permitAll()


                                // =================================================
                                // USER MANAGEMENT
                                // =================================================
                                // Sirf ADMIN users ko access.

                                .requestMatchers(
                                        "/users/**"
                                )
                                .hasRole("ADMIN")


                                // =================================================
                                // ADMIN APIs
                                // =================================================
                                // Sirf ADMIN access kar sakta hai.

                                .requestMatchers(
                                        "/admin/**"
                                )
                                .hasRole("ADMIN")


                                // =================================================
                                // STUDENT APIs
                                // =================================================
                                // ADMIN + STUDENT dono access kar sakte hain.

                                .requestMatchers(
                                        "/students/**"
                                )
                                .hasAnyRole(
                                        "ADMIN",
                                        "STUDENT"
                                )


                                // =================================================
                                // COURSE APIs
                                // =================================================
                                // ADMIN + STUDENT dono access kar sakte hain.

                                .requestMatchers(
                                        "/courses/**"
                                )
                                .hasAnyRole(
                                        "ADMIN",
                                        "STUDENT"
                                )


                                // =================================================
                                // ENROLLMENT APIs
                                // =================================================
                                // ADMIN + STUDENT dono access kar sakte hain.

                                .requestMatchers(
                                        "/enrollments/**"
                                )
                                .hasAnyRole(
                                        "ADMIN",
                                        "STUDENT"
                                )


                                // =================================================
                                // PROFILE APIs
                                // =================================================
                                // ADMIN + STUDENT dono apna profile
                                // access kar sakte hain.

                                .requestMatchers(
                                        "/profile/**"
                                )
                                .hasAnyRole(
                                        "ADMIN",
                                        "STUDENT"
                                )


                                // =================================================
                                // DASHBOARD APIs
                                // =================================================
                                // ADMIN + STUDENT dono access kar sakte hain.

                                .requestMatchers(
                                        "/dashboard/**"
                                )
                                .hasAnyRole(
                                        "ADMIN",
                                        "STUDENT"
                                )


                                // =================================================
                                // ALL OTHER REQUESTS
                                // =================================================
                                // Baaki sab requests ke liye
                                // JWT authentication required.

                                .anyRequest()
                                .authenticated()
                )


                // =================================================
                // JWT AUTHENTICATION FILTER
                // =================================================
                // JWT filter ko Spring Security ke default
                // UsernamePasswordAuthenticationFilter se pehle
                // execute karenge.

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        // =========================================================
        // BUILD SECURITY FILTER CHAIN
        // =========================================================

        return http.build();
    }

}
