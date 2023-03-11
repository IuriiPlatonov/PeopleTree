package com.people.repositories.impl;

import com.people.model.Card;
import com.people.model.CardObject;
import com.people.model.mapper.CardChildrenIdsMapper;
import com.people.model.mapper.CardObjectMapper;
import com.people.model.mapper.PersonMapper;
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
    @Value("#{sqlReader.getStatement('sqls/update/cardPanelPosition.sql')}")
    private String updateCardPositionV2;
    @Value("#{sqlReader.getStatement('sqls/delete/person.sql')}")
    private String deleteCard;
    @Value("#{sqlReader.getStatement('sqls/update/person.sql')}")
    private String updateCard;
    @Value("#{sqlReader.getStatement('sqls/update/cards.sql')}")
    private String updateCards;
    @Value("#{sqlReader.getStatement('sqls/create/person.sql')}")
    private String createCard;
    @Value("#{sqlReader.getStatement('sqls/children.sql')}")
    private String children;
    @Value("#{sqlReader.getStatement('sqls/childrenCount.sql')}")
    private String childrenCount;
    @Value("#{sqlReader.getStatement('sqls/personByParentId.sql')}")
    private String cardByParentId;
    @Value("#{sqlReader.getStatement('sqls/cards.sql')}")
    private String cardsByWorkspaceId;
    @Value("#{sqlReader.getStatement('sqls/cardPatterns.sql')}")
    private String cardPatterns;
    @Value("#{sqlReader.getStatement('sqls/cardPatternById.sql')}")
    private String cardPatternById;
    @Value("#{sqlReader.getStatement('sqls/create/card.sql')}")
    private String createCardV2;
    @Value("#{sqlReader.getStatement('sqls/create/createCardSet.sql')}")
    private String createCardSetSql;
    @Value("#{sqlReader.getStatement('sqls/delete/card.sql')}")
    private String deleteCardsSql;
    @Value("#{sqlReader.getStatement('sqls/delete/cardSet.sql')}")
    private String deleteCardSetsSql;
    @Value("#{sqlReader.getStatement('sqls/delete/deleteWorkspace.sql')}")
    private String deleteWorkspaceSql;
    @Value("#{sqlReader.getStatement('sqls/delete/getCardFirstLevelNodes.sql')}")
    private String getCardFirstLevelNodesSql;
    @Value("#{sqlReader.getStatement('sqls/update/saveTextValueSql.sql')}")
    private String saveTextValueSql;

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
    public void deleteCardsV2(List<CardObject> cardIds) {
        String sql = deleteCardsSql;
        Map<String, Object>[] allParams = new Map[cardIds.size()];
        cardIds.stream().map(bean -> {
            Map<String, Object> params = new HashMap<>();
            params.put("card_id", new BigDecimal(bean.getCardId()));
            return params;
        }).toList().toArray(allParams);

        namedParameterJdbcOperations.batchUpdate(sql, allParams);
    }

    @Override
    public void deleteCardSets(List<CardObject> cardIds) {
        String sql = deleteCardSetsSql;
        Map<String, Object>[] allParams = new Map[cardIds.size()];
        cardIds.stream().map(bean -> {
            Map<String, Object> params = new HashMap<>();
            params.put("card_id", new BigDecimal(bean.getCardId()));
            return params;
        }).toList().toArray(allParams);

        namedParameterJdbcOperations.batchUpdate(sql, allParams);
    }

    @Override
    public void deleteWorkspace(String workspaceId) {
        String sql = deleteWorkspaceSql;
        Map<String, Object> params = new HashMap<>();
        params.put("ws_id", new BigDecimal(workspaceId));

        namedParameterJdbcOperations.update(sql, params);
    }

    @Override
    public List<CardObject> getCardFirstLevelNodes(String cardId) {
        String sql = getCardFirstLevelNodesSql;
        Map<String, Object> params = new HashMap<>();
        params.put("card_id", new BigDecimal(cardId));
        return namedParameterJdbcOperations.query(sql, params, new CardObjectMapper());
    }

    @Override
    public void saveTextValue(String elementId, String value) {
        String sql = saveTextValueSql;
        Map<String, Object> params = new HashMap<>();
        params.put("value", value);
        params.put("element_id",  new BigDecimal(elementId));
        namedParameterJdbcOperations.update(sql, params);
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
    public void updateCardsParent(List<CardObject>  cardFirstLevelNodes) {
        String sql = updateCards;
        Map<String, Object>[] allParams = new Map[cardFirstLevelNodes.size()];
        cardFirstLevelNodes.stream().map(object -> {
            Map<String, Object> params = new HashMap<>();
            params.put("card_id", new BigDecimal(object.getCardId()));
            params.put("parent_id", RepositoryUtils.getBigDecimalOrNull(object.getParentId()));
            return params;
        }).toList().toArray(allParams);

        namedParameterJdbcOperations.batchUpdate(sql, allParams);
    }

    @Override
    public List<CardObject> getCardsByWorkspaceId(String workspaceId) {
        String sql = cardsByWorkspaceId;
        Map<String, Object> params = new HashMap<>();
        params.put("ws_id", new BigDecimal(workspaceId));
        return namedParameterJdbcOperations.query(sql, params, new CardObjectMapper());
    }

    @Override
    public List<CardObject> getCardPatterns(String userId) {
        String sql = cardPatterns;
        Map<String, Object> params = new HashMap<>();
        params.put("user_id", new BigDecimal(userId));
        return namedParameterJdbcOperations.query(sql, params, new CardObjectMapper());
    }

    @Override
    public void createCard(String cardId, String userId, String workspaceId, String isPattern, String parentId) {
        String sql = createCardV2;
        Map<String, Object> params = new HashMap<>();
        params.put("card_id", new BigDecimal(cardId));
        params.put("user_id", new BigDecimal(userId));
        params.put("ws_id", RepositoryUtils.getBigDecimalOrNull(workspaceId));
        params.put("is_pattern", new BigDecimal(isPattern));
        params.put("parent_id", RepositoryUtils.getBigDecimalOrNull(parentId));

        namedParameterJdbcOperations.update(sql, params);
    }

    @Override
    public List<CardObject> getCardPatternById(String cardId) {
        String sql = cardPatternById;
        Map<String, Object> params = new HashMap<>();
        params.put("card_id", new BigDecimal(cardId));
        return namedParameterJdbcOperations.query(sql, params, new CardObjectMapper());
    }

    @Override
    public void createCardSet(List<CardObject> pattern) {
        String sql = createCardSetSql;
        Map<String, Object>[] allParams = new Map[pattern.size()];
        pattern.stream().map(object -> {
            Map<String, Object> params = new HashMap<>();
            params.put("card_set_id", new BigDecimal(object.getElementId()));
            params.put("new_card_id", new BigDecimal(object.getCardId()));
            params.put("element_identifier", object.getElementIdentifier());
            params.put("pos_x", new BigDecimal(object.getPosX()));
            params.put("pos_y", new BigDecimal(object.getPosY()));
            params.put("pos_z", new BigDecimal(object.getPosZ()));
            params.put("height", new BigDecimal(object.getHeight()));
            params.put("width", new BigDecimal(object.getWidth()));
            params.put("value", object.getValue());
            return params;
        }).toList().toArray(allParams);

        namedParameterJdbcOperations.batchUpdate(sql, allParams);
    }

    @Override
    public List<CardObject> getCardChildrenIds(String cardId) {
        String sql = childrenCount;
        Map<String, Object> params = new HashMap<>();
        params.put("id", new BigDecimal(cardId));
        return namedParameterJdbcOperations.query(sql, params, new CardChildrenIdsMapper());
    }



    @Override
    public void updatePositionV2(String id, String posX, String posY) {
        String sql = updateCardPositionV2;
        Map<String, Object> params = new HashMap<>();
        params.put("id", new BigDecimal(id));
        params.put("pos_x", new BigDecimal(posX));
        params.put("pos_y", new BigDecimal(posY));

        namedParameterJdbcOperations.update(sql, params);
    }


}
