package com.people.services;

import java.util.List;

import com.people.dto.PersonDto;
import com.people.dto.PositionDto;

public interface PeopleService {

    void updateCardPosition(PositionDto position);

    List<PersonDto> getPeople(String userId);

    void delete(PersonDto person);

    void update(PersonDto person);

    PersonDto create(PersonDto person);
}
