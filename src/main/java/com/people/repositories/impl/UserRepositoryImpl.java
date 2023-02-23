package com.people.repositories.impl;

import com.people.model.User;
import com.people.model.mapper.UserMapper;
import com.people.repositories.UserRepository;
import com.people.utils.RandomGUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {

    private final NamedParameterJdbcOperations namedParameterJdbcOperations;

    @Value("#{sqlReader.getStatement('sqls/create/user.sql')}")
    private String createUser;
    @Value("#{sqlReader.getStatement('sqls/findUserByEmail.sql')}")
    private String findUserByEmail;


    @Override
    public void create(User object) {
        String sql = createUser;
        Map<String, Object> params = new HashMap<>();
        params.put("user_id", new BigDecimal(object.getId()));
        params.put("first_name", object.getFirstName());
        params.put("last_name", object.getLastName());
        params.put("patronymic", object.getPatronymic());
        params.put("email", object.getEmail());
        params.put("password", object.getPassword());
        params.put("role", object.getRole().toString());
        params.put("age", object.getAge());

        namedParameterJdbcOperations.update(sql, params);
    }

    @Override
    public void update(User object) {

    }

    @Override
    public void delete(User object) {

    }

    @Override
    public User getById(String id) {
        return null;
    }

    @Override
    public Optional<User> findByEmail(String email) {
        String sql = findUserByEmail;
        Map<String, Object> params = new HashMap<>();
        params.put("email", email);
        List<User> users = namedParameterJdbcOperations.query(sql, params, new UserMapper());

        return users.stream().findFirst();
    }
}
