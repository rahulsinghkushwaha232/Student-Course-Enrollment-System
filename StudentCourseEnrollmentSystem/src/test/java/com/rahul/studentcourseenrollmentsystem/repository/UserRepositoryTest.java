package com.rahul.studentcourseenrollmentsystem.repository;

import com.rahul.studentcourseenrollmentsystem.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void findByEmail_ShouldReturnUser() {

        // Arrange
        User user = new User();

        user.setEmail("rahul@gmail.com");
        user.setPassword("password123");
        user.setRole("STUDENT");
        user.setName("Rahul Singh");
        user.setPhone("9876543210");
        user.setAddress("India");

        userRepository.save(user);

        // Act
        Optional<User> result =
                userRepository.findByEmail("rahul@gmail.com");

        // Assert
        assertTrue(result.isPresent());

        assertEquals(
                "rahul@gmail.com",
                result.get().getEmail()
        );

        assertEquals(
                "Rahul Singh",
                result.get().getName()
        );

        assertEquals(
                "STUDENT",
                result.get().getRole()
        );
    }


    @Test
    void findByEmail_ShouldReturnEmpty_WhenEmailDoesNotExist() {

        // Act
        Optional<User> result =
                userRepository.findByEmail("notfound@gmail.com");

        // Assert
        assertTrue(result.isEmpty());
    }
}