package com.people.services;

import com.people.dto.CardDto;
import com.people.dto.DefaultBean;
import com.people.dto.ObjectDto;
import com.people.dto.PositionDto;
import com.people.dto.response.DeleteParentResponse;

import java.security.Principal;
import java.util.List;
import java.util.Map;

public interface CardService {

    void updateCardPosition(PositionDto position);

    List<CardDto> getCards(String userId);

    Map<String, List<ObjectDto>> getCards(String workspaceId, Principal principal);

    List<CardDto> delete(CardDto card);

    void update(CardDto card);

    CardDto create(CardDto card);

    DefaultBean getChildrenCount(String cardId);

//    DeleteParentResponse deleteParent(CardDto card);

    void updateCardPositionV2(PositionDto position);

    Map<String, List<ObjectDto>> getCardPatterns(Principal principal);

    Map<String, List<ObjectDto>> createCard(ObjectDto Object, Principal principal);

    DefaultBean getCardChildrenCount(String cardId);

    List<ObjectDto> deleteCard(ObjectDto card);

    List<ObjectDto> deleteWorkspace(ObjectDto workspace);

    DeleteParentResponse changeParent(ObjectDto card);

    void saveTextValue(ObjectDto card);
}
