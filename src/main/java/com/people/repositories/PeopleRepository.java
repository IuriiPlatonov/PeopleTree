package com.people.repositories;

import com.people.model.Person;

public interface PeopleRepository extends Repository<Person> {
	void updatePosition(String id, String posX, String posY);
}
