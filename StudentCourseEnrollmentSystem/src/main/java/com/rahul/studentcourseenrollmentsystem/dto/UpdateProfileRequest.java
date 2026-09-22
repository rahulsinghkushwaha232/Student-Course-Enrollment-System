package com.rahul.studentcourseenrollmentsystem.dto;

public class UpdateProfileRequest {

    private String name;

    private String phone;

    private String address;


    // =========================================================
    // GET NAME
    // =========================================================

    public String getName() {
        return name;
    }


    // =========================================================
    // SET NAME
    // =========================================================

    public void setName(String name) {
        this.name = name;
    }


    // =========================================================
    // GET PHONE
    // =========================================================

    public String getPhone() {
        return phone;
    }


    // =========================================================
    // SET PHONE
    // =========================================================

    public void setPhone(String phone) {
        this.phone = phone;
    }


    // =========================================================
    // GET ADDRESS
    // =========================================================

    public String getAddress() {
        return address;
    }


    // =========================================================
    // SET ADDRESS
    // =========================================================

    public void setAddress(String address) {
        this.address = address;
    }
}