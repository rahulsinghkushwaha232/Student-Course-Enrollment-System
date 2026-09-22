package com.rahul.studentcourseenrollmentsystem.service;

import com.rahul.studentcourseenrollmentsystem.entity.Course;
import com.rahul.studentcourseenrollmentsystem.exception.ResourceNotFoundException;
import com.rahul.studentcourseenrollmentsystem.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    // Save Course
    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    // Get All Courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Get Course By Id
    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found with id " + id));
    }

    // Update Course
    public Course updateCourse(Long id, Course updatedCourse) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found with id " + id));

        course.setCourseName(updatedCourse.getCourseName());
        course.setDuration(updatedCourse.getDuration());
        course.setInstructor(updatedCourse.getInstructor());
        course.setFee(updatedCourse.getFee());

        return courseRepository.save(course);
    }

    // Delete Course
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
}
