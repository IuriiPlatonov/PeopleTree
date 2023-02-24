package com.people.dto.mapper;

import com.people.dto.CardDto;
import com.people.model.Card;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonDtoMapper {

	public CardDto toDto(Card entity) {
		return CardDto.builder().id(entity.getId()).firstName(entity.getFirstName())
				.secondName(entity.getSecondName()).patronymic(entity.getPatronymic()).email(entity.getEmail())
				.age(entity.getAge()).address(entity.getAddress()).posX(entity.getPosX()).posY(entity.getPosY())
				.workspaceId(entity.getWorkspaceId())
				.build();
	}

	public List<CardDto> toDtos(List<Card> entities) {
		return entities.stream()
				.map(entity -> CardDto.builder().id(entity.getId()).parentId(entity.getParentId()).firstName(entity.getFirstName())
						.secondName(entity.getSecondName()).patronymic(entity.getPatronymic()).email(entity.getEmail())
						.age(entity.getAge()).address(entity.getAddress()).posX(entity.getPosX()).posY(entity.getPosY())
						.workspaceId(entity.getWorkspaceId())
						.build())
				.toList();
	}

	public Card toEntity(CardDto dto) {
		return Card.builder().id(dto.getId()).firstName(dto.getFirstName()).secondName(dto.getSecondName())
				.patronymic(dto.getPatronymic()).email(dto.getEmail()).age(dto.getAge()).address(dto.getAddress())
				.posX(dto.getPosX()).posY(dto.getPosY()).parentId(dto.getParentId())
				.workspaceId(dto.getWorkspaceId()).build();
	}
}
