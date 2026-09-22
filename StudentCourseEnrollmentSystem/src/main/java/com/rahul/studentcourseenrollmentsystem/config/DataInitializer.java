package com.rahul.studentcourseenrollmentsystem.config;

import com.rahul.studentcourseenrollmentsystem.entity.Course;
import com.rahul.studentcourseenrollmentsystem.entity.Student;
import com.rahul.studentcourseenrollmentsystem.entity.User;
import com.rahul.studentcourseenrollmentsystem.repository.CourseRepository;
import com.rahul.studentcourseenrollmentsystem.repository.StudentRepository;
import com.rahul.studentcourseenrollmentsystem.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            CourseRepository courseRepository,
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        // =========================================================
        // 1. SEED DEFAULT USERS (ADMIN & STUDENT)
        // =========================================================
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("@Admin123"));
            admin.setRole("ADMIN");
            admin.setName("Administrator");
            admin.setPhone("9999999999");
            admin.setAddress("Tech HQ, New Delhi");

            User student = new User();
            student.setEmail("student@example.com");
            student.setPassword(passwordEncoder.encode("@Student123"));
            student.setRole("STUDENT");
            student.setName("Demo Student");
            student.setPhone("8888888888");
            student.setAddress("Sector 15, Noida");

            userRepository.saveAll(Arrays.asList(admin, student));
            System.out.println(">>> DataInitializer: Default users (admin@example.com & student@example.com) created.");
        }

        // =========================================================
        // 2. SEED DEFAULT COURSES
        // =========================================================
        if (courseRepository.count() == 0) {
            Course c1 = new Course(null, "Full Stack Java Masterclass", "6 Months", "Rahul Sharma", 14999.0);
            Course c2 = new Course(null, "React & Next.js Pro Bootcamp", "3 Months", "Priya Verma", 9999.0);
            Course c3 = new Course(null, "Spring Boot Microservices & Cloud", "4 Months", "Amit Patel", 12999.0);
            Course c4 = new Course(null, "Data Structures & Algorithms in Java", "4 Months", "Neha Gupta", 8999.0);
            Course c5 = new Course(null, "AI & Machine Learning with Python", "5 Months", "Dr. Vikram Singh", 17999.0);

            courseRepository.saveAll(Arrays.asList(c1, c2, c3, c4, c5));
            System.out.println(">>> DataInitializer: 5 Sample courses seeded successfully.");
        }

        // =========================================================
        // 3. SEED DEFAULT STUDENTS
        // =========================================================
        if (studentRepository.count() == 0) {
            Student s1 = new Student(null, "Rahul Verma", "rahul.verma@example.com", "Full Stack Java Masterclass", "9876543210", "Sector 62, Noida");
            Student s2 = new Student(null, "Ananya Roy", "ananya.roy@example.com", "React & Next.js Pro Bootcamp", "9876543211", "Salt Lake, Kolkata");
            Student s3 = new Student(null, "Kunal Deshmukh", "kunal.d@example.com", "Spring Boot Microservices & Cloud", "9876543212", "Kothrud, Pune");

            studentRepository.saveAll(Arrays.asList(s1, s2, s3));
            System.out.println(">>> DataInitializer: 3 Sample students seeded successfully.");
        }
    }
}
