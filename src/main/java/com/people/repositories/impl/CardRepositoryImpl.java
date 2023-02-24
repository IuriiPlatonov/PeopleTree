package com.people.repositories.impl;

import com.people.model.Card;
import com.people.model.Settings;
import com.people.model.mapper.PersonMapper;
import com.people.model.mapper.SettingsMapper;
import com.people.repositories.CardRepository;
import com.people.utils.RepositoryUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class CardRepositoryImpl implements CardRepository {

    private final NamedParameterJdbcOperations namedParameterJdbcOperations;

    @Value("#{sqlReader.getStatement('sqls/people.sql')}")
    private String cards;
    @Value("#{sqlReader.getStatement('sqls/update/personPosition.sql')}")
    private String updateCardPosition;
    @Value("#{sqlReader.getStatement('sqls/delete/person.sql')}")
    private String deleteCard;
    @Value("#{sqlReader.getStatement('sqls/update/person.sql')}")
    private String updateCard;
    @Value("#{sqlReader.getStatement('sqls/create/person.sql')}")
    private String createCard;
    @Value("#{sqlReader.getStatement('sqls/children.sql')}")
    private String children;
    @Value("#{sqlReader.getStatement('sqls/personByParentId.sql')}")
    private String cardByParentId;

//    @Value("#{sqlReader.getStatement('sqls/delete/people.sql')}")
//    private String deletePeople;

    @Override
    public void create(Card object) {
        String sql = createCard;
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
    public void update(Card object) {
        String sql = updateCard;
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
    public void delete(Card object) {
        String sql = deleteCard;
        Map<String, Object> params = new HashMap<>();
        params.put("id", new BigDecimal(object.getId()));

        namedParameterJdbcOperations.update(sql, params);
    }

    @Override
    public List<Card> getCardsForWorkspace(String workspaceId) {
        String sql = cards;
        Map<String, Object> params = new HashMap<>();
        params.put("ws_id", new BigDecimal(workspaceId));
        return namedParameterJdbcOperations.query(sql, params, new PersonMapper());
    }

    @Override
    public Card getById(String id) {
        return null;
    }

    @Override
    public void updatePosition(String id, String posX, String posY) {
        String sql = updateCardPosition;
        Map<String, Object> params = new HashMap<>();
        params.put("id", new BigDecimal(id));
        params.put("pos_x", new BigDecimal(posX));
        params.put("pos_y", new BigDecimal(posY));

        namedParameterJdbcOperations.update(sql, params);
    }

    @Override
    public List<Card> getChildren(String id) {
        String sql = children;
        Map<String, Object> params = new HashMap<>();
        params.put("id", new BigDecimal(id));
        return namedParameterJdbcOperations.query(sql, params, new PersonMapper());
    }

    @Override
    @SuppressWarnings("unchecked")
    public void deleteCards(List<Card> cards) {
        String sql = deleteCard;
        Map<String, Object>[] allParams = new Map[cards.size()];
        cards.stream().map(bean -> {
            Map<String, Object> params = new HashMap<>();
            params.put("id", new BigDecimal(bean.getId()));
            return params;
        }).toList().toArray(allParams);

        namedParameterJdbcOperations.batchUpdate(sql, allParams);
    }

    @Override
    public List<Card> getCardsByParentId(String id) {
        String sql = cardByParentId;
        Map<String, Object> params = new HashMap<>();
        params.put("parentId", new BigDecimal(id));
        return namedParameterJdbcOperations.query(sql, params, new PersonMapper());
    }

    @Override
    @SuppressWarnings("unchecked")
    public void updateCards(List<Card> firstChildren) {
        String sql = updateCard;
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



}
