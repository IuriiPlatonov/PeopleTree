package com.people.dto.mapper;

import com.people.dto.ObjectDto;
import com.people.model.CardObject;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CardObjectDtoMapper {

    public ObjectDto toDto(CardObject entity) {
        return ObjectDto.builder()
                .workspaceId(entity.getWorkspaceId())
                .userId(entity.getUserId())
                .cardId(entity.getCardId())
                .elementId(entity.getElementId())
                .elementIdentifier(entity.getElementIdentifier())
                .posX(entity.getPosX())
                .posY(entity.getPosY())
                .posZ(entity.getPosZ())
                .parentId(entity.getParentId())
                .value(entity.getValue())
                .height(entity.getHeight())
                .value(entity.getValue())
                .build();
    }

    public List<ObjectDto> toDtos(List<CardObject> entities) {
        return entities.stream()
                .map(entity -> ObjectDto.builder()
                        .workspaceId(entity.getWorkspaceId())
                        .userId(entity.getUserId())
                        .cardId(entity.getCardId())
                        .elementId(entity.getElementId())
                        .elementIdentifier(entity.getElementIdentifier())
                        .posX(entity.getPosX())
                        .posY(entity.getPosY())
                        .posZ(entity.getPosZ())
                        .parentId(entity.getParentId())
                        .value(entity.getValue())
                        .height(entity.getHeight())
                        .width(entity.getWidth())
                        .build())
                .toList();
    }

    public Map<String, List<ObjectDto>> toDtoMap(List<CardObject> entities) {
        Map<String, List<ObjectDto>> result = new HashMap<>();
        entities.forEach(entity -> {
            ObjectDto object = ObjectDto.builder()
                    .workspaceId(entity.getWorkspaceId())
                    .userId(entity.getUserId())
                    .cardId(entity.getCardId())
                    .elementId(entity.getElementId())
                    .elementIdentifier(entity.getElementIdentifier())
                    .posX(entity.getPosX())
                    .posY(entity.getPosY())
                    .posZ(entity.getPosZ())
                    .parentId(entity.getParentId())
                    .value(entity.getValue())
                    .height(entity.getHeight())
                    .width(entity.getWidth())
                    .build();
            List<ObjectDto> newList = new ArrayList<>();
            newList.add(object);
            Optional<List<ObjectDto>> existList = Optional.ofNullable(result.get(entity.getCardId()));
            existList.ifPresentOrElse(value -> value.add(object), () -> result.put(entity.getCardId(), newList));

        });
        return result;

    }

    public CardObject toEntity(ObjectDto dto) {
        return CardObject.builder()
                .workspaceId(dto.getWorkspaceId())
                .userId(dto.getUserId())
                .cardId(dto.getCardId())
                .elementId(dto.getElementId())
                .elementIdentifier(dto.getElementIdentifier())
                .posX(dto.getPosX())
                .posY(dto.getPosY())
                .posZ(dto.getPosZ())
                .parentId(dto.getParentId())
                .value(dto.getValue())
                .height(dto.getHeight())
                .width(dto.getWidth())
                .build();
    }
}
