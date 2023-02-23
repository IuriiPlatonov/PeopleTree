package com.people.repositories;

import com.people.model.User;

import java.util.Optional;

public interface UserRepository extends Repository<User> {

    Optional<User> findByEmail(String email);

}
