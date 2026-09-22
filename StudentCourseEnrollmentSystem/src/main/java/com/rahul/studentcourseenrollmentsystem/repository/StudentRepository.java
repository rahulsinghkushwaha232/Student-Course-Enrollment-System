package com.rahul.studentcourseenrollmentsystem.repository;

import com.rahul.studentcourseenrollmentsystem.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {

}