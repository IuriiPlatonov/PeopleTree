package com.people.model.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.people.model.Person;

public class PersonMapper implements RowMapper<Person> {

	@Override
	public Person mapRow(ResultSet rs, int rowNum) throws SQLException {
		return Person.builder().id(rs.getString("p_id")).parentId(rs.getString("p_p_id")).firstName(rs.getString("first_name"))
				.secondName(rs.getString("second_name")).patronymic(rs.getString("patronymic"))
				.email(rs.getString("email")).age(rs.getString("age")).address(rs.getString("address"))
				.posX(rs.getString("pos_x")).posY(rs.getString("pos_y")).build();

	}

}
