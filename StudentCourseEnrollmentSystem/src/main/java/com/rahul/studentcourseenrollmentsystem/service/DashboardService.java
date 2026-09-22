package com.rahul.studentcourseenrollmentsystem.service;

import com.rahul.studentcourseenrollmentsystem.repository.CourseRepository;
import com.rahul.studentcourseenrollmentsystem.repository.EnrollmentRepository;
import com.rahul.studentcourseenrollmentsystem.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public DashboardService(
            StudentRepository studentRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository
    ) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public Map<String, Long> getDashboardCounts() {

        long students = studentRepository.count();
        long courses = courseRepository.count();
        long enrollments = enrollmentRepository.count();

        long totalRecords =
                students + courses + enrollments;

        Map<String, Long> counts = new HashMap<>();

        counts.put("students", students);
        counts.put("courses", courses);
        counts.put("enrollments", enrollments);
        counts.put("totalRecords", totalRecords);

        return counts;
    }
}