package com.people.services;

import java.util.List;

import com.people.dto.PersonDto;
import com.people.dto.PositionDto;

public interface PeopleService {

	void savePerson(PersonDto person);

	void updatePerson(PersonDto person);

	void updateCardPosition(PositionDto position);
	
	List<PersonDto> getPeople();

	void delete(PersonDto person);

	void update(PersonDto person);
}
