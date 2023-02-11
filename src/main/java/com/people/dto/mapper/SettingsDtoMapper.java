package com.people.dto.mapper;

import org.springframework.stereotype.Service;

import com.people.dto.SettingsDto;
import com.people.model.Settings;

@Service
public class SettingsDtoMapper {
    public SettingsDto toDto(Settings entity) {
	return SettingsDto.builder().id(entity.getId()).userId(entity.getUserId()).theme(entity.getTheme())
		.screenScale(entity.getScreenScale()).build();
    }

//	public List<PersonDto> toDtos(List<Person> entities) {
//		return entities.stream()
//				.map(entity -> PersonDto.builder().id(entity.getId()).parentId(entity.getParentId()).firstName(entity.getFirstName())
//						.secondName(entity.getSecondName()).patronymic(entity.getPatronymic()).email(entity.getEmail())
//						.age(entity.getAge()).address(entity.getAddress()).posX(entity.getPosX()).posY(entity.getPosY())
//						.build())
//				.toList();
//	}
//
//	public Person toEntity(PersonDto dto) {
//		return Person.builder().id(dto.getId()).firstName(dto.getFirstName()).secondName(dto.getSecondName())
//				.patronymic(dto.getPatronymic()).email(dto.getEmail()).age(dto.getAge()).address(dto.getAddress())
//				.posX(dto.getPosX()).posY(dto.getPosY()).parentId(dto.getParentId()).build();
//	}
}
