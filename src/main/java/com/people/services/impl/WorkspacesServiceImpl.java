package com.people.services.impl;

import com.people.dto.ObjectDto;
import com.people.dto.UserDto;
import com.people.dto.mapper.CardObjectDtoMapper;
import com.people.model.CardObject;
import com.people.repositories.WorkspacesRepository;
import com.people.services.UserService;
import com.people.services.WorkspacesService;
import com.people.utils.RandomGUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WorkspacesServiceImpl implements WorkspacesService {

    private final WorkspacesRepository workspacesRepository;
    private final UserService userService;

    private final CardObjectDtoMapper cardObjectDtoMapper;

    @Override
    public List<ObjectDto> getWorkspacesForUser(String userId) {
        return cardObjectDtoMapper.toDtos(workspacesRepository.getWorkspacesByUserId(userId));
    }

    @Override
    public Map<String, List<ObjectDto>> getWorkspacesByUserEmail(String email) {
        UserDto user = userService.getByEmail(email);
        return cardObjectDtoMapper.toDtoMap(workspacesRepository.getWorkspacesByUserId(user.getId()));
    }

    @Override
    public Map<String, List<ObjectDto>> createWorkspace(ObjectDto object, Principal principal) {
//        var user = userService.getByEmail(principal.getName());
//        String newCardId = RandomGUID.newValue();
//        workspacesRepository.create(CardObject.builder()
//                .workspaceId(RandomGUID.newValue())
//                .cardId(newCardId)
//                .userId(user.getId())
//                .build());
//        cardRepository.createCard(newCardId, user.getId(), object.getWorkspaceId(), "0", object.getParentId());
//        List<CardObject> pattern = cardRepository.getCardPatternById(object.getCardId());
//        pattern.forEach(bean -> {
//            bean.setElementId(RandomGUID.newValue());
//            bean.setCardId(newCardId);
//            if (bean.getElementIdentifier().equals(CARD_PANEL_IDENTIFIER)) {
//                bean.setPosX(generateNewNearCord(object.getPosX()));
//                bean.setPosY(generateNewNearCord(object.getPosY()));
//                bean.setParentId(object.getParentId());
//            }
//        });
//        cardRepository.createCardSet(pattern);
        return null; //cardObjectDtoMapper.toDtoMap(pattern);
    }
}
