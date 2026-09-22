package com.rahul.studentcourseenrollmentsystem.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.function.Function;


@Service
public class JwtService {


    // =========================================================
    // SECRET KEY
    // =========================================================

    private static final String SECRET_KEY =
            "VGhpcyBpcyBhIHNlY3JldCBrZXkgZm9yIFN0dWRlbnQgQ291cnNlIEVucm9sbG1lbnQgU3lzdGVt";


    // =========================================================
    // TOKEN EXPIRATION
    // 24 HOURS
    // =========================================================

    private static final long EXPIRATION_TIME =
            1000 * 60 * 60 * 24;


    // =========================================================
    // GET SIGNING KEY
    // =========================================================

    private SecretKey getSignInKey() {

        byte[] keyBytes =
                Decoders.BASE64.decode(SECRET_KEY);

        return Keys.hmacShaKeyFor(keyBytes);
    }


    // =========================================================
    // GENERATE JWT TOKEN
    // =========================================================

    public String generateToken(String username) {

        return Jwts.builder()

                .subject(username)

                .issuedAt(
                        new Date()
                )

                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + EXPIRATION_TIME
                        )
                )

                .signWith(
                        getSignInKey()
                )

                .compact();
    }


    // =========================================================
    // EXTRACT USERNAME
    // =========================================================

    public String extractUsername(String token) {

        return extractClaim(
                token,
                Claims::getSubject
        );
    }


    // =========================================================
    // EXTRACT CLAIM
    // =========================================================

    public <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver
    ) {

        final Claims claims =
                extractAllClaims(token);

        return claimsResolver.apply(claims);
    }


    // =========================================================
    // EXTRACT ALL CLAIMS
    // =========================================================

    private Claims extractAllClaims(String token) {

        return Jwts.parser()

                .verifyWith(
                        getSignInKey()
                )

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }


    // =========================================================
    // VALIDATE TOKEN
    // =========================================================

    public boolean isTokenValid(
            String token,
            String username
    ) {

        try {

            final String extractedUsername =
                    extractUsername(token);

            return extractedUsername.equals(username)
                    && !isTokenExpired(token);

        } catch (Exception exception) {

            return false;
        }
    }


    // =========================================================
    // CHECK TOKEN EXPIRATION
    // =========================================================

    private boolean isTokenExpired(
            String token
    ) {

        return extractExpiration(token)
                .before(
                        new Date()
                );
    }


    // =========================================================
    // GET EXPIRATION
    // =========================================================

    private Date extractExpiration(
            String token
    ) {

        return extractClaim(
                token,
                Claims::getExpiration
        );
    }

}