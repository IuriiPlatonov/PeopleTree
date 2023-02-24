package com.people.repositories.impl;

import com.people.model.Workspace;
import com.people.model.mapper.WorkspaceMapper;
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
    public List<Workspace> getWorkspacesByUserId(String userId) {
        String sql = workspace;
        Map<String, Object> params = new HashMap<>();
        params.put("user_id", new BigDecimal(userId));
        return namedParameterJdbcOperations.query(sql, params, new WorkspaceMapper());
    }

    @Override
    public void create(Workspace object) {
        String sql = createWorkspace;
        Map<String, Object> params = new HashMap<>();
        params.put("ws_id", new BigDecimal(object.getId()));
        params.put("user_id", new BigDecimal(object.getUserId()));
        params.put("kind_id", StringUtils.isBlank(object.getKindId()) ? null : new BigDecimal(object.getKindId()));

        namedParameterJdbcOperations.update(sql, params);
    }

    @Override
    public void update(Workspace object) {

    }

    @Override
    public void delete(Workspace object) {

    }

    @Override
    public Workspace getById(String id) {
        return null;
    }
}
