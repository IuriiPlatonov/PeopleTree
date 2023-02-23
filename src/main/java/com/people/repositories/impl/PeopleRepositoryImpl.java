package com.people.repositories.impl;

import com.people.model.Person;
import com.people.model.Settings;
import com.people.model.Workspace;
import com.people.model.mapper.PersonMapper;
import com.people.model.mapper.SettingsMapper;
import com.people.model.mapper.WorkspaceMapper;
import com.people.repositories.PeopleRepository;
import com.people.utils.RepositoryUtils;
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
public class PeopleRepositoryImpl implements PeopleRepository {

    private final NamedParameterJdbcOperations namedParameterJdbcOperations;

    @Value("#{sqlReader.getStatement('sqls/people.sql')}")
    private String people;
    @Value("#{sqlReader.getStatement('sqls/update/personPosition.sql')}")
    private String updatePersonPosition;
    @Value("#{sqlReader.getStatement('sqls/delete/person.sql')}")
    private String deletePerson;
    @Value("#{sqlReader.getStatement('sqls/update/person.sql')}")
    private String updatePerson;
    @Value("#{sqlReader.getStatement('sqls/create/person.sql')}")
    private String createPerson;
    @Value("#{sqlReader.getStatement('sqls/settings.sql')}")
    private String getSettings;
    @Value("#{sqlReader.getStatement('sqls/children.sql')}")
    private String children;
    @Value("#{sqlReader.getStatement('sqls/personByParentId.sql')}")
    private String personByParentId;
    @Value("#{sqlReader.getStatement('sqls/create/workspace.sql')}")
    private String createWorkspace;
    @Value("#{sqlReader.getStatement('sqls/workspace.sql')}")
    private String workspace;
//    @Value("#{sqlReader.getStatement('sqls/delete/people.sql')}")
//    private String deletePeople;

    @Override
    public void create(Person object) {
        String sql = createPerson;
        Map<String, Object> params = new HashMap<>();
        params.put("id", new BigDecimal(object.getId()));
        params.put("p_p_id", RepositoryUtils.getBigDecimalOrNull(object.getParentId()));
        params.put("pos_x", RepositoryUtils.getBigDecimalOrZero(object.getPosX()));
        params.put("pos_y", RepositoryUtils.getBigDecimalOrZero(object.getPosY()));
        params.put("first_name", object.getFirstName());
        params.put("second_name", object.getSecondName());
        params.put("patronymic", object.getPatronymic());
        params.put("email", object.getEmail());
        params.put("age", RepositoryUtils.getBigDecimalOrNull(object.getAge()));
        params.put("address", object.getAddress());
        params.put("ws_id", new BigDecimal(object.getWorkspaceId()));

        namedParameterJdbcOperations.update(sql, params);
    }

    @Override
    public void update(Person object) {
        String sql = updatePerson;
        Map<String, Object> params = new HashMap<>();
        params.put("id", new BigDecimal(object.getId()));
        params.put("parent_id", RepositoryUtils.getBigDecimalOrNull(object.getParentId()));
        params.put("first_name", object.getFirstName());
        params.put("second_name", object.getSecondName());
        params.put("patronymic", object.getPatronymic());
        params.put("email", object.getEmail());
        params.put("age", RepositoryUtils.getBigDecimalOrNull(object.getAge()));
        params.put("address", object.getAddress());

        namedParameterJdbcOperations.update(sql, params);
    }

    @Override
    public void delete(Person object) {
        String sql = deletePerson;
        Map<String, Object> params = new HashMap<>();
        params.put("id", new BigDecimal(object.getId()));

        namedParameterJdbcOperations.update(sql, params);
    }

    @Override
    public List<Person> getPeopleTree(String workspaceId) {
        String sql = people;
        Map<String, Object> params = new HashMap<>();
        params.put("ws_id", new BigDecimal(workspaceId));
        return namedParameterJdbcOperations.query(sql, params, new PersonMapper());
    }

    @Override
    public Person getById(String id) {
        return null;
    }

    @Override
    public void updatePosition(String id, String posX, String posY) {
        String sql = updatePersonPosition;
        Map<String, Object> params = new HashMap<>();
        params.put("id", new BigDecimal(id));
        params.put("pos_x", new BigDecimal(posX));
        params.put("pos_y", new BigDecimal(posY));

        namedParameterJdbcOperations.update(sql, params);
    }

    @Override
    public Settings getSettings(String userId) {
        String sql = getSettings;
        Map<String, Object> params = new HashMap<>();
        params.put("id", new BigDecimal(userId));
        return namedParameterJdbcOperations.query(sql, params, new SettingsMapper()).get(0);
    }

    @Override
    public List<Person> getChildren(String id) {
        String sql = children;
        Map<String, Object> params = new HashMap<>();
        params.put("id", new BigDecimal(id));
        return namedParameterJdbcOperations.query(sql, params, new PersonMapper());
    }

    @Override
    @SuppressWarnings("unchecked")
    public void deletePeople(List<Person> people) {
        String sql = deletePerson;
        Map<String, Object>[] allParams = new Map[people.size()];
        people.stream().map(bean -> {
            Map<String, Object> params = new HashMap<>();
            params.put("id", new BigDecimal(bean.getId()));
            return params;
        }).toList().toArray(allParams);

        namedParameterJdbcOperations.batchUpdate(sql, allParams);
    }

    @Override
    public List<Person> getPersonByParentId(String id) {
        String sql = personByParentId;
        Map<String, Object> params = new HashMap<>();
        params.put("parentId", new BigDecimal(id));
        return namedParameterJdbcOperations.query(sql, params, new PersonMapper());
    }

    @Override
    @SuppressWarnings("unchecked")
    public void updatePeople(List<Person> firstChildren) {
        String sql = updatePerson;
        Map<String, Object>[] allParams = new Map[firstChildren.size()];
        firstChildren.stream().map(object -> {
            Map<String, Object> params = new HashMap<>();
            params.put("id", new BigDecimal(object.getId()));
            params.put("parent_id", RepositoryUtils.getBigDecimalOrNull(object.getParentId()));
            params.put("first_name", object.getFirstName());
            params.put("second_name", object.getSecondName());
            params.put("patronymic", object.getPatronymic());
            params.put("email", object.getEmail());
            params.put("age", RepositoryUtils.getBigDecimalOrNull(object.getAge()));
            params.put("address", object.getAddress());
            return params;
        }).toList().toArray(allParams);

        namedParameterJdbcOperations.batchUpdate(sql, allParams);
    }

    @Override
    public void createWorkspace(Workspace object) {
        String sql = createWorkspace;
        Map<String, Object> params = new HashMap<>();
        params.put("ws_id", new BigDecimal(object.getId()));
        params.put("user_id", new BigDecimal(object.getUserId()));
        params.put("kind_id", StringUtils.isBlank(object.getKindId()) ? null : new BigDecimal(object.getKindId()));


        namedParameterJdbcOperations.update(sql, params);
    }

    @Override
    public List<Workspace> getWorkspaces(String userId) {
        String sql = workspace;
        Map<String, Object> params = new HashMap<>();
        params.put("user_id", new BigDecimal(userId));
        return namedParameterJdbcOperations.query(sql, params, new WorkspaceMapper());
    }

}
