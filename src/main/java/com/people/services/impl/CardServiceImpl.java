package com.people.services.impl;

import com.people.dto.CardDto;
import com.people.dto.DefaultBean;
import com.people.dto.ObjectDto;
import com.people.dto.PositionDto;
import com.people.dto.mapper.CardObjectDtoMapper;
import com.people.dto.mapper.PersonDtoMapper;
import com.people.dto.mapper.SettingsDtoMapper;
import com.people.dto.response.DeleteParentResponse;
import com.people.model.Card;
import com.people.model.CardObject;
import com.people.repositories.CardRepository;
import com.people.repositories.WorkspacesRepository;
import com.people.services.CardService;
import com.people.services.UserService;
import com.people.services.WorkspacesService;
import com.people.utils.RandomGUID;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {

    private static final String CARD_PANEL_IDENTIFIER = "CARD_PANEL";

    private final CardRepository cardRepository;
    private final PersonDtoMapper personDtoMapper;
    private final SettingsDtoMapper settingsDtoMapper;
    private final WorkspacesService workspacesService;
    private final WorkspacesRepository workspacesRepository;
    private final UserService userService;
    private final CardObjectDtoMapper cardObjectDtoMapper;

    @Override
    public List<CardDto> getCards(String userId) {
        var workspaces = workspacesService.getWorkspacesForUser(userId);
        var workspace = workspaces.stream().findFirst().orElse(new ObjectDto());
        return personDtoMapper.toDtos(cardRepository.getCardsForWorkspace(workspace.getWorkspaceId()));
    }

    @Override
    public Map<String, List<ObjectDto>> getCards(String workspaceId, Principal principal) {
        //      var user = userService.getByEmail(principal.getName());
        //      var cards = cardRepository.getCardsByWorkspaceId(workspaceId);
        return cardObjectDtoMapper.toDtoMap(cardRepository.getCardsByWorkspaceId(workspaceId));
    }

    @Override
    public Map<String, List<ObjectDto>> getCardPatterns(Principal principal) {
        var user = userService.getByEmail(principal.getName());
        return cardObjectDtoMapper.toDtoMap(cardRepository.getCardPatterns(user.getId()));
    }

    @Override
    @Transactional
    public Map<String, List<ObjectDto>> createCard(ObjectDto object, Principal principal) {
        var user = userService.getByEmail(principal.getName());
        String newCardId = RandomGUID.newValue();
        String newWorkspaceId = RandomGUID.newValue();
        if (StringUtils.isBlank(object.getWorkspaceId())) {
            workspacesRepository.create(CardObject.builder()
                    .workspaceId(newWorkspaceId)
                    .cardId(newCardId)
                    .userId(user.getId())
                    .build());
        }
        cardRepository.createCard(newCardId, user.getId(), object.getWorkspaceId(), "0", object.getParentId());
        List<CardObject> pattern = cardRepository.getCardPatternById(object.getCardId());
        pattern.forEach(bean -> {
            bean.setElementId(RandomGUID.newValue());
            bean.setCardId(newCardId);
            if (bean.getElementIdentifier().equals(CARD_PANEL_IDENTIFIER)) {
                if (StringUtils.isBlank(object.getWorkspaceId())) {
                    bean.setWorkspaceId(newWorkspaceId);
                }
                bean.setPosX(generateNewNearCord(object.getPosX()));
                bean.setPosY(generateNewNearCord(object.getPosY()));
                bean.setParentId(object.getParentId());
            }
        });
        cardRepository.createCardSet(pattern);
        return cardObjectDtoMapper.toDtoMap(pattern);
    }

    @Override
    public DefaultBean getCardChildrenCount(String cardId) {
        List<CardObject> children = cardRepository.getCardChildrenIds(cardId);
        return DefaultBean.builder().data(String.valueOf(children.size())).build();
    }

    private String generateNewNearCord(String oldValue) {
        double coordinate = StringUtils.isBlank(oldValue) ? 0 : Double.parseDouble(oldValue);
        return String.valueOf(coordinate + (200 * Math.random() > 0.5 ? -1 : 1) + (150 * Math.random()));
    }

    @Override
    public void updateCardPosition(PositionDto position) {
        cardRepository.updatePosition(position.getId(), position.getPosX(), position.getPosY());
    }

    @Override
    @Transactional
    public List<CardDto> delete(CardDto person) {
        List<Card> peopleForDelete = cardRepository.getChildren(person.getId());
        cardRepository.deleteCards(peopleForDelete);
        return personDtoMapper.toDtos(peopleForDelete);
    }

    @Override
    @Transactional
    public List<ObjectDto> deleteCard(ObjectDto card) {
        List<CardObject> cardIds = cardRepository.getCardChildrenIds(card.getCardId());
        cardRepository.deleteCardsV2(cardIds);
        cardRepository.deleteCardSets(cardIds);
        return cardObjectDtoMapper.toDtos(cardIds);
    }

    @Override
    @Transactional
    public List<ObjectDto> deleteWorkspace(ObjectDto workspace) {
        List<CardObject> workspaceCardIds = cardRepository.getCardChildrenIds(workspace.getCardId());
        cardRepository.deleteWorkspace(workspace.getWorkspaceId());
        List<CardObject> cardIdsOwnedWorkspace  =  cardRepository.getCardsByWorkspaceId(workspace.getWorkspaceId());
        cardRepository.deleteCardsV2(cardIdsOwnedWorkspace);
        cardRepository.deleteCardSets(cardIdsOwnedWorkspace);
        cardRepository.deleteCardsV2(workspaceCardIds);
        cardRepository.deleteCardSets(workspaceCardIds);
        return cardObjectDtoMapper.toDtos(workspaceCardIds);
    }

    //TODO
    @Override
    @Transactional
    public DeleteParentResponse changeParent(ObjectDto card) {
        List<CardObject> cardFirstLevelNodes = cardRepository.getCardFirstLevelNodes(card.getCardId());
        cardFirstLevelNodes.forEach(bean -> bean.setParentId(card.getParentId()));
        cardRepository.updateCardsParent(cardFirstLevelNodes);
        cardRepository.deleteCardsV2(List.of(cardObjectDtoMapper.toEntity(card)));
        cardRepository.deleteCardSets(List.of(cardObjectDtoMapper.toEntity(card)));
        return DeleteParentResponse.builder()
                .parent(card)
                .children(cardObjectDtoMapper.toDtos(cardFirstLevelNodes))
                .build();
    }

    @Override
    public void saveTextValue(ObjectDto card) {
        cardRepository.saveTextValue(card.getElementId(), card.getValue());
    }

//    @Deprecated
//    @Override
//    @Transactional
//    public DeleteParentResponse deleteParent(CardDto person) {
//        List<Card> firstChildren = cardRepository.getCardsByParentId(person.getId());
//        firstChildren.forEach(bean -> bean.setParentId(person.getParentId()));
//        //cardRepository.updateCards(firstChildren);
//        cardRepository.delete(personDtoMapper.toEntity(person));
//        return DeleteParentResponse.builder().parent(person).children(personDtoMapper.toDtos(firstChildren)).build();
//    }

    @Override
    public void updateCardPositionV2(PositionDto position) {
        cardRepository.updatePositionV2(position.getId(), position.getPosX(), position.getPosY());
    }

    @Override
    public void update(CardDto person) {
        cardRepository.update(personDtoMapper.toEntity(person));

    }

    @Override
    public CardDto create(CardDto person) {
        String id = RandomGUID.newValue();
        person.setId(id);
        cardRepository.create(personDtoMapper.toEntity(person));
        return person;
    }

    @Override
    public DefaultBean getChildrenCount(String personId) {
        List<Card> children = cardRepository.getChildren(personId);
        return DefaultBean.builder().id(String.valueOf(children.size())).build();
    }

}
