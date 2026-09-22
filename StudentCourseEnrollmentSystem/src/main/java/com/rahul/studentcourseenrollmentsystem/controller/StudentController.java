package com.rahul.studentcourseenrollmentsystem.controller;

import com.rahul.studentcourseenrollmentsystem.entity.Course;
import com.rahul.studentcourseenrollmentsystem.entity.Student;
import com.rahul.studentcourseenrollmentsystem.service.EnrollmentService;
import com.rahul.studentcourseenrollmentsystem.service.StudentService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
@RequestMapping("/students")
public class StudentController {


    // =========================================================
    // SERVICES
    // =========================================================

    private final StudentService studentService;

    private final EnrollmentService enrollmentService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public StudentController(
            StudentService studentService,
            EnrollmentService enrollmentService
    ) {

        this.studentService = studentService;

        this.enrollmentService = enrollmentService;
    }


    // =========================================================
    // SAVE STUDENT
    // =========================================================

    @PostMapping
    public Student saveStudent(
            @RequestBody @Valid Student student
    ) {

        return studentService.saveStudent(student);
    }


    // =========================================================
    // GET ALL STUDENTS
    // =========================================================

    @GetMapping
    public List<Student> getAllStudents() {

        return studentService.getAllStudents();
    }


    // =========================================================
    // GET STUDENT BY ID
    // =========================================================

    @GetMapping("/{id}")
    public Student getStudentById(
            @PathVariable Long id
    ) {

        return studentService.getStudentById(id);
    }


    // =========================================================
    // UPDATE STUDENT
    // =========================================================

    @PutMapping
    public Student updateStudent(
            @RequestBody Student student
    ) {

        System.out.println(
                "========== UPDATE STUDENT =========="
        );

        System.out.println(
                "ID      : " + student.getId()
        );

        System.out.println(
                "Name    : " + student.getName()
        );

        System.out.println(
                "Email   : " + student.getEmail()
        );

        System.out.println(
                "Course  : " + student.getCourse()
        );

        System.out.println(
                "Phone   : " + student.getPhone()
        );

        System.out.println(
                "Address : " + student.getAddress()
        );

        return studentService.updateStudent(student);
    }


    // =========================================================
    // DELETE STUDENT
    // =========================================================

    @DeleteMapping("/{id}")
    public void deleteStudent(
            @PathVariable Long id
    ) {

        studentService.deleteStudent(id);
    }


    // =========================================================
    // GET ALL COURSES OF A STUDENT
    // =========================================================

    @GetMapping("/{id}/courses")
    public List<Course> getCoursesByStudentId(
            @PathVariable Long id
    ) {

        return enrollmentService
                .getCoursesByStudentId(id);
    }

}