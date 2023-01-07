package com.people.services.impl;

import java.math.BigInteger;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.people.dto.PersonDto;
import com.people.dto.PositionDto;
import com.people.dto.mapper.PersonDtoMapper;
import com.people.repositories.PeopleRepository;
import com.people.services.PeopleService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PeopleServiceImpl implements PeopleService {

    private final PeopleRepository peopleRepository;
    private final PersonDtoMapper personDtoMapper;

    @Override
    public List<PersonDto> getPeople(String userId) {
	return personDtoMapper.toDtos(peopleRepository.getPeopleTree(userId));
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

    @Override
    public PersonDto create(PersonDto person) {
	String id = new BigInteger(UUID.randomUUID().toString().replace("-", ""), 16).toString();
	person.setId(id);
	peopleRepository.create(personDtoMapper.toEntity(person));
	return person;
    }

}
