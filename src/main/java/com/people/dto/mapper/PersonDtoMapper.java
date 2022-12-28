package com.people.dto.mapper;

import java.util.List;

import org.springframework.stereotype.Service;

import com.people.dto.PersonDto;
import com.people.model.Person;

@Service
public class PersonDtoMapper {

	public PersonDto toDto(Person entity) {
		return PersonDto.builder().id(entity.getId()).firstName(entity.getFirstName())
				.secondName(entity.getSecondName()).patronymic(entity.getPatronymic()).email(entity.getEmail())
				.age(entity.getAge()).address(entity.getAddress()).posX(entity.getPosX()).posY(entity.getPosY())
				.build();
	}

	public List<PersonDto> toDtos(List<Person> entities) {
		return entities.stream()
				.map(entity -> PersonDto.builder().id(entity.getId()).parentId(entity.getParentId()).firstName(entity.getFirstName())
						.secondName(entity.getSecondName()).patronymic(entity.getPatronymic()).email(entity.getEmail())
						.age(entity.getAge()).address(entity.getAddress()).posX(entity.getPosX()).posY(entity.getPosY())
						.build())
				.toList();
	}

	public Person toEntity(PersonDto dto) {
		return Person.builder().id(dto.getId()).firstName(dto.getFirstName()).secondName(dto.getSecondName())
				.patronymic(dto.getPatronymic()).email(dto.getEmail()).age(dto.getAge()).address(dto.getAddress())
				.posX(dto.getPosX()).posY(dto.getPosY()).build();
	}
}
