package com.bookmanager.service;

import com.bookmanager.model.User;
import com.bookmanager.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    // GET ALL USERS

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    // GET USER BY ID


    public ResponseEntity<User> getUserById(Long id) {

        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    // ADD USER

    public User addUser(User user) {

        return userRepository.save(user);
    }

    // UPDATE USER

    public ResponseEntity<User> updateUser(
            Long id,
            User user) {

        return userRepository.findById(id)

                .map(existingUser -> {

                    existingUser.setUserName(
                            user.getUserName()
                    );

                    existingUser.setUserEmail(
                            user.getUserEmail()
                    );

                    existingUser.setUserPassword(
                            user.getUserPassword()
                    );

                    existingUser.setUserRole(
                            user.getUserRole()
                    );


                    User updatedUser =
                            userRepository.save(
                                    existingUser
                            );


                    return ResponseEntity.ok(
                            updatedUser
                    );

                })

                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    // DELETE USER
    public ResponseEntity<Void> deleteUser(Long id) {

        if (!userRepository.existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        userRepository.deleteById(id);


        return ResponseEntity
                .ok()
                .build();
    }
}