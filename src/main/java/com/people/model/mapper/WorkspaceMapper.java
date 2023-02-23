package com.people.model.mapper;

import com.people.model.Workspace;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class WorkspaceMapper implements RowMapper<Workspace> {

    @Override
    public Workspace mapRow(ResultSet rs, int rowNum) throws SQLException {
        return Workspace.builder()
                .id(rs.getString("ws_id"))
                .userId(rs.getString("user_id"))
                .kindId(rs.getString("kind_id"))
                .build();

    }
}