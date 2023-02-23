package com.people.model.mapper;

import com.people.enums.Role;
import com.people.model.User;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserMapper implements RowMapper<User> {

    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {
        return User.builder().id(rs.getString("user_id")).firstName(rs.getString("first_name"))
                .lastName(rs.getString("last_name")).patronymic(rs.getString("patronymic"))
                .email(rs.getString("email")).age(rs.getString("age"))
                .password(rs.getString("password")).role(Role.getBySuffix(rs.getString("role")))
                .build();

    }
}
