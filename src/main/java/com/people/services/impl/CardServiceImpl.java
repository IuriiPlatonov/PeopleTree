package com.people.services.impl;

import com.people.dto.*;
import com.people.dto.mapper.PersonDtoMapper;
import com.people.dto.mapper.SettingsDtoMapper;
import com.people.dto.response.DeleteParentResponse;
import com.people.model.Card;
import com.people.repositories.CardRepository;
import com.people.services.CardService;
import com.people.services.WorkspacesService;
import com.people.utils.RandomGUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {

    private final CardRepository cardRepository;
    private final PersonDtoMapper personDtoMapper;
    private final SettingsDtoMapper settingsDtoMapper;
    private final WorkspacesService workspacesService;

    @Override
    public List<CardDto> getCards(String userId) {
        var workspaces = workspacesService.getWorkspacesForUser(userId);
        var workspace = workspaces.stream().findFirst().orElse(new WorkspaceDto());
        return personDtoMapper.toDtos(cardRepository.getCardsForWorkspace(workspace.getId()));
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
    public DeleteParentResponse deleteParent(CardDto person) {
        List<Card> firstChildren = cardRepository.getCardsByParentId(person.getId());
        firstChildren.forEach(bean -> bean.setParentId(person.getParentId()));
        cardRepository.updateCards(firstChildren);
        cardRepository.delete(personDtoMapper.toEntity(person));
        return DeleteParentResponse.builder().parent(person).children(personDtoMapper.toDtos(firstChildren)).build();
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
