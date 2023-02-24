package com.people.model.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import com.people.model.Card;
import org.springframework.jdbc.core.RowMapper;

public class PersonMapper implements RowMapper<Card> {

	@Override
	public Card mapRow(ResultSet rs, int rowNum) throws SQLException {
		return Card.builder()
				.id(rs.getString("p_id"))
				.parentId(rs.getString("p_p_id"))
				.firstName(rs.getString("first_name"))
				.secondName(rs.getString("second_name"))
				.patronymic(rs.getString("patronymic"))
				.email(rs.getString("email"))
				.age(rs.getString("age"))
				.address(rs.getString("address"))
				.posX(rs.getString("pos_x"))
				.posY(rs.getString("pos_y"))
				.workspaceId(rs.getString("ws_id"))
				.build();

	}

}
