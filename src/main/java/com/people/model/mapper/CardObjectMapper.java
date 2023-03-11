package com.people.model.mapper;

import com.people.model.CardObject;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class CardObjectMapper implements RowMapper<CardObject> {

    @Override
    public CardObject mapRow(ResultSet rs, int rowNum) throws SQLException {
        return CardObject.builder()
                .workspaceId(rs.getString("ws_id"))
                .userId(rs.getString("user_id"))
                .cardId(rs.getString("card_id"))
                .elementId(rs.getString("card_set_id"))
                .elementIdentifier(rs.getString("element_identifier"))
                .posX(rs.getString("pos_x"))
                .posY(rs.getString("pos_y"))
                .posZ(rs.getString("pos_z"))
                .parentId(rs.getString("parent_id"))
                .value(rs.getString("value"))
                .height(rs.getString("height"))
                .width(rs.getString("width"))
                .build();

    }
}