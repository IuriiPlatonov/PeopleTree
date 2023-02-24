package com.people.repositories;

import java.util.List;

import com.people.model.Card;
import com.people.model.Settings;

public interface CardRepository extends Repository<Card> {
    void updatePosition(String id, String posX, String posY);

    List<Card> getCardsForWorkspace(String workspaceId);

    List<Card> getChildren(String id);

    void deleteCards(List<Card> cards);

    List<Card> getCardsByParentId(String id);

    void updateCards(List<Card> firstChildren);


}
