package com.people.repositories;

import java.util.List;

import com.people.model.Person;
import com.people.model.Settings;

public interface PeopleRepository extends Repository<Person> {
    void updatePosition(String id, String posX, String posY);

    List<Person> getPeopleTree(String id);

    Settings getSettings(String userId);

    List<Person> getChildren(String id);

    void deletePeople(List<Person> people);

    List<Person> getPersonByParentId(String id);

    void updatePeople(List<Person> firstChildren);
}
