package com.rahul.studentcourseenrollmentsystem.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    // =========================================================
    // ID
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================================
    // EMAIL
    // =========================================================

    @Column(
            nullable = false,
            unique = true
    )
    private String email;


    // =========================================================
    // PASSWORD
    // =========================================================

    @Column(
            nullable = false
    )
    private String password;


    // =========================================================
    // ROLE
    // =========================================================

    @Column(
            nullable = false
    )
    private String role;


    // =========================================================
    // NAME
    // =========================================================

    @Column
    private String name;


    // =========================================================
    // PHONE
    // =========================================================

    @Column
    private String phone;


    // =========================================================
    // ADDRESS
    // =========================================================

    @Column
    private String address;


    // =========================================================
    // PROFILE IMAGE
    // =========================================================

    @Column(
            length = 1000
    )
    private String profileImage;


    // =========================================================
    // DEFAULT CONSTRUCTOR
    // =========================================================

    public User() {
    }


    // =========================================================
    // PARAMETERIZED CONSTRUCTOR
    // =========================================================

    public User(
            Long id,
            String email,
            String password,
            String role,
            String name,
            String phone,
            String address,
            String profileImage
    ) {

        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.profileImage = profileImage;
    }


    // =========================================================
    // GETTERS & SETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }


    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

}