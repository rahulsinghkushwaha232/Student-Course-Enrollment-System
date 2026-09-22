package com.rahul.studentcourseenrollmentsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Course Name is required")
    private String courseName;

    @NotBlank(message = "Duration is required")
    private String duration;

    @NotBlank(message = "Instructor is required")
    private String instructor;

    @NotNull(message = "Course Fee is required")
    @PositiveOrZero(message = "Course Fee cannot be negative")
    private Double fee;

    public Course() {

    }

    public Course(Long id, String courseName, String duration, String instructor, Double fee) {
        this.id = id;
        this.courseName = courseName;
        this.duration = duration;
        this.instructor = instructor;
        this.fee = fee;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }

    public Double getFee() {
        return fee;
    }

    public void setFee(Double fee) {
        this.fee = fee;
    }
}