package com.people.repositories.impl;

import com.people.model.CardObject;
import com.people.model.mapper.CardObjectMapper;
import com.people.repositories.WorkspacesRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class WorkspacesRepositoryImpl implements WorkspacesRepository {

    private final NamedParameterJdbcOperations namedParameterJdbcOperations;

    @Value("#{sqlReader.getStatement('sqls/create/workspace.sql')}")
    private String createWorkspace;
    @Value("#{sqlReader.getStatement('sqls/workspace.sql')}")
    private String workspace;

    @Override
    public List<CardObject> getWorkspacesByUserId(String userId) {
        String sql = workspace;
        Map<String, Object> params = new HashMap<>();
        params.put("user_id", new BigDecimal(userId));
        return namedParameterJdbcOperations.query(sql, params, new CardObjectMapper());
    }

    @Override
    public void create(CardObject object) {
        String sql = createWorkspace;
        Map<String, Object> params = new HashMap<>();
        params.put("ws_id", new BigDecimal(object.getWorkspaceId()));
        params.put("user_id", new BigDecimal(object.getUserId()));
        params.put("card_id", StringUtils.isBlank(object.getCardId()) ? null : new BigDecimal(object.getCardId()));

        namedParameterJdbcOperations.update(sql, params);
    }

    @Override
    public void update(CardObject object) {

    }

    @Override
    public void delete(CardObject object) {

    }

    @Override
    public CardObject getById(String id) {
        return null;
    }
}
