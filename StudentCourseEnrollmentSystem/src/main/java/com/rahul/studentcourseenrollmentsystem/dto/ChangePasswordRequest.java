package com.rahul.studentcourseenrollmentsystem.dto;

public class ChangePasswordRequest {

    private String currentPassword;

    private String newPassword;

    private String confirmPassword;


    // =========================================================
    // GETTERS
    // =========================================================

    public String getCurrentPassword() {
        return currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }


    // =========================================================
    // SETTERS
    // =========================================================

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}