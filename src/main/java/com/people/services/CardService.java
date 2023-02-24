package com.people.services;

import java.util.List;

import com.people.dto.*;
import com.people.dto.response.DeleteParentResponse;

public interface CardService {

    void updateCardPosition(PositionDto position);

    List<CardDto> getCards(String userId);

    List<CardDto> delete(CardDto card);

    void update(CardDto card);

    CardDto create(CardDto card);

    DefaultBean getChildrenCount(String cardId);

    DeleteParentResponse deleteParent(CardDto card);


}
