package com.people.services.impl;

import com.people.dto.DefaultBean;
import com.people.dto.PersonDto;
import com.people.dto.PositionDto;
import com.people.dto.SettingsDto;
import com.people.dto.mapper.PersonDtoMapper;
import com.people.dto.mapper.SettingsDtoMapper;
import com.people.dto.response.DeleteParentResponse;
import com.people.model.Person;
import com.people.repositories.PeopleRepository;
import com.people.services.PeopleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PeopleServiceImpl implements PeopleService {

    private static final String PARENT = "parent";
    private static final String CHILDREN = "children";
    private final PeopleRepository peopleRepository;
    private final PersonDtoMapper personDtoMapper;
    private final SettingsDtoMapper settingsDtoMapper;

    @Override
    public List<PersonDto> getPeople(String userId) {
        return personDtoMapper.toDtos(peopleRepository.getPeopleTree(userId));
    }

    @Override
    public void updateCardPosition(PositionDto position) {
        peopleRepository.updatePosition(position.getId(), position.getPosX(), position.getPosY());
    }

    @Override
    @Transactional
    public List<PersonDto> delete(PersonDto person) {
        List<Person> peopleForDelete = peopleRepository.getChildren(person.getId());
        peopleRepository.deletePeople(peopleForDelete);
        return personDtoMapper.toDtos(peopleForDelete);
    }

    @Override
    public DeleteParentResponse deleteParent(PersonDto person) {
        List<Person> firstChildren = peopleRepository.getPersonByParentId(person.getId());
        firstChildren.forEach(bean -> bean.setParentId(person.getParentId()));
        peopleRepository.updatePeople(firstChildren);
        peopleRepository.delete(personDtoMapper.toEntity(person));
        return DeleteParentResponse.builder().parent(person).children(personDtoMapper.toDtos(firstChildren)).build();
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

    @Override
    public SettingsDto getSettings(String userId) {
        return settingsDtoMapper.toDto(peopleRepository.getSettings(userId));
    }

    @Override
    public DefaultBean getChildrenCount(String personId) {
        List<Person> children = peopleRepository.getChildren(personId);
        return DefaultBean.builder().id(String.valueOf(children.size())).build();
    }

}
