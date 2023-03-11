package com.people.model.mapper;

import com.people.model.CardObject;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class CardChildrenIdsMapper implements RowMapper<CardObject> {

    @Override
    public CardObject mapRow(ResultSet rs, int rowNum) throws SQLException {
        return CardObject.builder().cardId(rs.getString("card_id")).build();
    }

}
