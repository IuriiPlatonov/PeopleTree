package com.people.repositories;

import com.people.model.Card;
import com.people.model.CardObject;

import java.util.List;

public interface CardRepository extends Repository<Card> {
    void updatePosition(String id, String posX, String posY);

    List<Card> getCardsForWorkspace(String workspaceId);

    List<Card> getChildren(String id);

    void deleteCards(List<Card> cards);

    List<Card> getCardsByParentId(String id);

    void updateCardsParent(List<CardObject>  cardFirstLevelNodes);

    List<CardObject> getCardsByWorkspaceId(String workspaceId);

    void updatePositionV2(String id, String posX, String posY);

    List<CardObject> getCardPatterns(String userId);

    void createCard(String cardId, String userId, String workspaceId, String isPattern, String parentId);

    List<CardObject> getCardPatternById(String cardId);

    void createCardSet(List<CardObject> pattern);

    List<CardObject> getCardChildrenIds(String cardId);

    void deleteCardsV2(List<CardObject> cardIds);

    void deleteCardSets(List<CardObject> cardIds);

    void deleteWorkspace(String workspaceId);

    List<CardObject> getCardFirstLevelNodes(String cardId);

    void saveTextValue(String elementId, String value);
}
