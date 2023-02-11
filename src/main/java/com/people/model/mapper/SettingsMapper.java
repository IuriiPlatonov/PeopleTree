package com.people.model.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.people.model.Settings;

public class SettingsMapper implements RowMapper<Settings> {

    @Override
    public Settings mapRow(ResultSet rs, int rowNum) throws SQLException {
	return Settings.builder().id(rs.getString("s_id")).userId(rs.getString("p_p_id"))
		.screenScale(rs.getString("screen_scale")).theme(rs.getString("theme")).build();

    }

}
