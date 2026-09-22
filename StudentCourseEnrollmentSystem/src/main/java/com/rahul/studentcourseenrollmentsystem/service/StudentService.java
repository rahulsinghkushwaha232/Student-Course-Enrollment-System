package com.rahul.studentcourseenrollmentsystem.service;

import com.rahul.studentcourseenrollmentsystem.entity.Student;
import com.rahul.studentcourseenrollmentsystem.exception.ResourceNotFoundException;
import com.rahul.studentcourseenrollmentsystem.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Save Student
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    // Get All Students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get Student By Id
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found with id " + id));
    }

    // Update Student
    public Student updateStudent(Student student) {

        Student existingStudent = studentRepository.findById(student.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found with id " + student.getId()));

        // Update basic fields
        existingStudent.setName(student.getName());
        existingStudent.setEmail(student.getEmail());
        existingStudent.setCourse(student.getCourse());

        // Update phone only if provided
        if (student.getPhone() != null) {
            existingStudent.setPhone(student.getPhone());
        }

        // Update address only if provided
        if (student.getAddress() != null) {
            existingStudent.setAddress(student.getAddress());
        }

        return studentRepository.save(existingStudent);
    }

    // Delete Student
    public void deleteStudent(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found with id " + id));

        studentRepository.delete(student);
    }
}