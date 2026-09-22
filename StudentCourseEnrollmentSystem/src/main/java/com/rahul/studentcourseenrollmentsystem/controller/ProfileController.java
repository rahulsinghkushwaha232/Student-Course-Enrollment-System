package com.rahul.studentcourseenrollmentsystem.controller;

import com.rahul.studentcourseenrollmentsystem.dto.ChangePasswordRequest;
import com.rahul.studentcourseenrollmentsystem.dto.UpdateProfileRequest;
import com.rahul.studentcourseenrollmentsystem.entity.User;
import com.rahul.studentcourseenrollmentsystem.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;


@RestController
@RequestMapping("/profile")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5176",
                "http://localhost:5177"
        }
)
public class ProfileController {


    // =========================================================
    // USER REPOSITORY
    // =========================================================

    private final UserRepository userRepository;


    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    private final PasswordEncoder passwordEncoder;


    // =========================================================
    // PROFILE IMAGE DIRECTORY
    // =========================================================

    private static final String UPLOAD_DIR =
            "uploads/profile-images";


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public ProfileController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {

        this.userRepository =
                userRepository;

        this.passwordEncoder =
                passwordEncoder;
    }


    // =========================================================
    // GET MY PROFILE
    // =========================================================

    @GetMapping
    public ResponseEntity<?> getMyProfile(
            Authentication authentication
    ) {

        // =====================================================
        // GET LOGGED-IN USER EMAIL
        // =====================================================

        String email =
                authentication.getName();


        // =====================================================
        // FIND USER
        // =====================================================

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);


        // =====================================================
        // USER NOT FOUND
        // =====================================================

        if (user == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        // =====================================================
        // RETURN PROFILE
        // =====================================================

        return ResponseEntity.ok(
                Map.of(
                        "id",
                        user.getId(),

                        "email",
                        user.getEmail(),

                        "role",
                        user.getRole(),

                        "name",
                        user.getName() != null
                                ? user.getName()
                                : "",

                        "phone",
                        user.getPhone() != null
                                ? user.getPhone()
                                : "",

                        "address",
                        user.getAddress() != null
                                ? user.getAddress()
                                : "",

                        "profileImage",
                        user.getProfileImage() != null
                                ? user.getProfileImage()
                                : ""
                )
        );
    }


    // =========================================================
    // UPDATE MY PROFILE
    // =========================================================
    //
    // PUT /profile
    //
    // Updates:
    // Name
    // Phone
    // Address
    //
    // Email, Role and Password are NOT changed here.
    // =========================================================

    @PutMapping
    public ResponseEntity<?> updateMyProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request
    ) {

        // =====================================================
        // GET LOGGED-IN USER EMAIL
        // =====================================================

        String email =
                authentication.getName();


        // =====================================================
        // FIND USER
        // =====================================================

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);


        // =====================================================
        // USER NOT FOUND
        // =====================================================

        if (user == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "User not found"
                            )
                    );
        }


        // =====================================================
        // REQUEST VALIDATION
        // =====================================================

        if (request == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Profile data is required"
                            )
                    );
        }


        // =====================================================
        // UPDATE NAME
        // =====================================================

        if (request.getName() != null) {

            String name =
                    request.getName().trim();


            if (name.isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Name cannot be empty"
                                )
                        );
            }


            if (name.length() > 100) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Name must not exceed 100 characters"
                                )
                        );
            }


            user.setName(name);
        }


        // =====================================================
        // UPDATE PHONE
        // =====================================================

        if (request.getPhone() != null) {

            String phone =
                    request.getPhone().trim();


            if (phone.length() > 20) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Phone number must not exceed 20 characters"
                                )
                        );
            }


            user.setPhone(phone);
        }


        // =====================================================
        // UPDATE ADDRESS
        // =====================================================

        if (request.getAddress() != null) {

            String address =
                    request.getAddress().trim();


            if (address.length() > 255) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Address must not exceed 255 characters"
                                )
                        );
            }


            user.setAddress(address);
        }


        // =====================================================
        // SAVE USER
        // =====================================================

        userRepository.save(user);


        // =====================================================
        // SUCCESS RESPONSE
        // =====================================================

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Profile updated successfully",

                        "id",
                        user.getId(),

                        "email",
                        user.getEmail(),

                        "role",
                        user.getRole(),

                        "name",
                        user.getName() != null
                                ? user.getName()
                                : "",

                        "phone",
                        user.getPhone() != null
                                ? user.getPhone()
                                : "",

                        "address",
                        user.getAddress() != null
                                ? user.getAddress()
                                : "",

                        "profileImage",
                        user.getProfileImage() != null
                                ? user.getProfileImage()
                                : ""
                )
        );
    }


    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request
    ) {

        // =====================================================
        // GET LOGGED-IN USER EMAIL
        // =====================================================

        String email =
                authentication.getName();


        // =====================================================
        // FIND USER
        // =====================================================

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);


        // =====================================================
        // USER NOT FOUND
        // =====================================================

        if (user == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "User not found"
                            )
                    );
        }


        // =====================================================
        // CURRENT PASSWORD
        // =====================================================

        if (
                request.getCurrentPassword() == null
                        ||
                        request.getCurrentPassword().isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Current password is required"
                            )
                    );
        }


        // =====================================================
        // VERIFY CURRENT PASSWORD
        // =====================================================

        if (
                !passwordEncoder.matches(
                        request.getCurrentPassword(),
                        user.getPassword()
                )
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Current password is incorrect"
                            )
                    );
        }


        // =====================================================
        // NEW PASSWORD
        // =====================================================

        if (
                request.getNewPassword() == null
                        ||
                        request.getNewPassword().isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "New password is required"
                            )
                    );
        }


        // =====================================================
        // CONFIRM PASSWORD
        // =====================================================

        if (
                request.getConfirmPassword() == null
                        ||
                        request.getConfirmPassword().isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Confirm password is required"
                            )
                    );
        }


        // =====================================================
        // PASSWORD MATCH
        // =====================================================

        if (
                !request.getNewPassword()
                        .equals(
                                request.getConfirmPassword()
                        )
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "New password and confirm password do not match"
                            )
                    );
        }


        // =====================================================
        // PASSWORD MUST BE DIFFERENT
        // =====================================================

        if (
                passwordEncoder.matches(
                        request.getNewPassword(),
                        user.getPassword()
                )
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "New password must be different from current password"
                            )
                    );
        }


        // =====================================================
        // PASSWORD LENGTH
        // =====================================================

        if (
                request.getNewPassword().length() < 6
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "New password must contain at least 6 characters"
                            )
                    );
        }


        // =====================================================
        // ENCODE PASSWORD
        // =====================================================

        String encodedPassword =
                passwordEncoder.encode(
                        request.getNewPassword()
                );


        user.setPassword(
                encodedPassword
        );


        // =====================================================
        // SAVE PASSWORD
        // =====================================================

        userRepository.save(user);


        // =====================================================
        // SUCCESS
        // =====================================================

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Password changed successfully"
                )
        );
    }


    // =========================================================
    // UPLOAD PROFILE IMAGE
    // =========================================================

    @PutMapping("/profile-image")
    public ResponseEntity<?> uploadProfileImage(
            Authentication authentication,
            @RequestParam("image") MultipartFile image
    ) {

        try {

            // =================================================
            // GET LOGGED-IN USER
            // =================================================

            String email =
                    authentication.getName();


            // =================================================
            // FIND USER
            // =================================================

            User user =
                    userRepository
                            .findByEmail(email)
                            .orElse(null);


            // =================================================
            // USER NOT FOUND
            // =================================================

            if (user == null) {

                return ResponseEntity
                        .status(404)
                        .body(
                                Map.of(
                                        "message",
                                        "User not found"
                                )
                        );
            }


            // =================================================
            // IMAGE REQUIRED
            // =================================================

            if (
                    image == null
                            ||
                            image.isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Profile image is required"
                                )
                        );
            }


            // =================================================
            // FILE TYPE VALIDATION
            // =================================================

            String contentType =
                    image.getContentType();


            if (
                    contentType == null
                            ||
                            (
                                    !contentType.equals("image/jpeg")
                                            &&
                                            !contentType.equals("image/png")
                                            &&
                                            !contentType.equals("image/webp")
                            )
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Only JPG, PNG and WEBP images are allowed"
                                )
                        );
            }


            // =================================================
            // FILE SIZE VALIDATION
            // Maximum = 5 MB
            // =================================================

            long maxSize =
                    5L * 1024 * 1024;


            if (image.getSize() > maxSize) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Image size must be less than 5 MB"
                                )
                        );
            }


            // =================================================
            // CREATE UPLOAD DIRECTORY
            // =================================================

            Path uploadPath =
                    Paths.get(
                            UPLOAD_DIR
                    );


            Files.createDirectories(
                    uploadPath
            );


            // =================================================
            // GET FILE EXTENSION
            // =================================================

            String originalFilename =
                    image.getOriginalFilename();


            String extension =
                    ".jpg";


            if (
                    originalFilename != null
                            &&
                            originalFilename.contains(".")
            ) {

                extension =
                        originalFilename
                                .substring(
                                        originalFilename
                                                .lastIndexOf(".")
                                )
                                .toLowerCase();
            }


            // =================================================
            // GENERATE UNIQUE FILE NAME
            // =================================================

            String fileName =
                    UUID.randomUUID()
                            .toString()
                            + extension;


            // =================================================
            // CREATE FILE PATH
            // =================================================

            Path filePath =
                    uploadPath.resolve(
                            fileName
                    );


            // =================================================
            // SAVE NEW IMAGE
            // =================================================

            Files.copy(
                    image.getInputStream(),
                    filePath
            );


            // =================================================
            // DELETE OLD IMAGE
            // =================================================

            String oldImage =
                    user.getProfileImage();


            if (
                    oldImage != null
                            &&
                            !oldImage.isBlank()
            ) {

                try {

                    /*
                     * Database:
                     *
                     * /uploads/profile-images/old.jpg
                     *
                     * File system:
                     *
                     * uploads/profile-images/old.jpg
                     */

                    String oldImageRelativePath =
                            oldImage;


                    if (
                            oldImageRelativePath
                                    .startsWith("/")
                    ) {

                        oldImageRelativePath =
                                oldImageRelativePath
                                        .substring(1);
                    }


                    Path oldImagePath =
                            Paths.get(
                                    oldImageRelativePath
                            );


                    Files.deleteIfExists(
                            oldImagePath
                    );

                } catch (Exception ignored) {

                    /*
                     * Old image delete fail hone par
                     * new upload ko fail nahi karna.
                     */

                }
            }


            // =================================================
            // BROWSER IMAGE URL
            // =================================================

            String imageUrl =
                    "/uploads/profile-images/"
                            + fileName;


            // =================================================
            // SAVE IMAGE URL IN DATABASE
            // =================================================

            user.setProfileImage(
                    imageUrl
            );


            userRepository.save(
                    user
            );


            // =================================================
            // SUCCESS RESPONSE
            // =================================================

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Profile image uploaded successfully",

                            "profileImage",
                            imageUrl
                    )
            );


        } catch (IOException exception) {

            exception.printStackTrace();


            return ResponseEntity
                    .internalServerError()
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to upload profile image"
                            )
                    );
        }
    }

}