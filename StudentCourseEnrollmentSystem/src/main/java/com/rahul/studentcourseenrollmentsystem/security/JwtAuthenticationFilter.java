package com.rahul.studentcourseenrollmentsystem.security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;


import java.io.IOException;


@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {


    private final JwtService jwtService;

    private final UserDetailsService userDetailsService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserDetailsService userDetailsService
    ) {

        this.jwtService =
                jwtService;

        this.userDetailsService =
                userDetailsService;
    }


    // =========================================================
    // FILTER
    // =========================================================

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    )
            throws ServletException, IOException {


        // =====================================================
        // GET AUTHORIZATION HEADER
        // =====================================================

        String authHeader =
                request.getHeader(
                        "Authorization"
                );


        String jwt = null;

        String username = null;


        // =====================================================
        // CHECK JWT HEADER
        // =====================================================

        if (
                authHeader != null
                        &&
                        authHeader.startsWith(
                                "Bearer "
                        )
        ) {

            jwt =
                    authHeader.substring(
                            7
                    );


            try {

                username =
                        jwtService.extractUsername(
                                jwt
                        );


            } catch (Exception exception) {

                System.out.println(
                        "Invalid JWT: "
                                +
                                exception.getMessage()
                );
            }
        }


        // =====================================================
        // AUTHENTICATE USER
        // =====================================================

        if (
                username != null
                        &&
                        SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                == null
        ) {


            try {


                // =================================================
                // LOAD USER FROM DATABASE
                // =================================================

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(
                                        username
                                );


                // =================================================
                // DEBUG USER
                // =================================================

                System.out.println(
                        "======================================"
                );

                System.out.println(
                        "JWT USER: "
                                +
                                userDetails.getUsername()
                );


                // =================================================
                // DEBUG ROLE / AUTHORITY
                // =================================================

                System.out.println(
                        "JWT AUTHORITIES: "
                                +
                                userDetails.getAuthorities()
                );


                // =================================================
                // VALIDATE JWT
                // =================================================

                if (
                        jwtService.isTokenValid(
                                jwt,
                                userDetails.getUsername()
                        )
                ) {


                    // =============================================
                    // CREATE AUTHENTICATION
                    // =============================================

                    UsernamePasswordAuthenticationToken authentication =

                            new UsernamePasswordAuthenticationToken(

                                    userDetails,

                                    null,

                                    userDetails.getAuthorities()
                            );


                    // =============================================
                    // SET REQUEST DETAILS
                    // =============================================

                    authentication.setDetails(

                            new WebAuthenticationDetailsSource()
                                    .buildDetails(
                                            request
                                    )
                    );


                    // =============================================
                    // SET SECURITY CONTEXT
                    // =============================================

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );


                    // =============================================
                    // DEBUG SUCCESS
                    // =============================================

                    System.out.println(
                            "JWT AUTHENTICATION: SUCCESS"
                    );

                } else {

                    System.out.println(
                            "JWT AUTHENTICATION: INVALID TOKEN"
                    );
                }


                System.out.println(
                        "======================================"
                );


            } catch (Exception exception) {


                System.out.println(
                        "JWT Authentication Error: "
                                +
                                exception.getMessage()
                );
            }
        }


        // =====================================================
        // CONTINUE FILTER CHAIN
        // =====================================================

        filterChain.doFilter(
                request,
                response
        );
    }

}