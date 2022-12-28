package com.people.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.people.dto.PersonDto;
import com.people.dto.PositionDto;
import com.people.dto.mapper.PersonDtoMapper;
import com.people.model.Person;
import com.people.repositories.PeopleRepository;
import com.people.services.PeopleService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PeopleServiceImpl implements PeopleService {

	private final PeopleRepository peopleRepository;
	private final PersonDtoMapper personDtoMapper;

	@Override
	public void savePerson(PersonDto person) {

	}

	@Override
	public List<PersonDto> getPeople() {
		return personDtoMapper.toDtos(peopleRepository.getAll());
	}

	@Override
	public void updatePerson(PersonDto person) {

	}

	@Override
	public void updateCardPosition(PositionDto position) {
		peopleRepository.updatePosition(position.getId(), position.getPosX(), position.getPosY());
	}

	@Override
	public void delete(PersonDto person) {
		peopleRepository.delete(personDtoMapper.toEntity(person));
	}

	@Override
	public void update(PersonDto person) {
		peopleRepository.update(personDtoMapper.toEntity(person));
		
	}

}
