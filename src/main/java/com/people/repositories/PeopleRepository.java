package com.people.repositories;

import java.util.List;

import com.people.model.Person;

public interface PeopleRepository extends Repository<Person> {
    void updatePosition(String id, String posX, String posY);

    List<Person>  getPeopleTree(String id);
}
