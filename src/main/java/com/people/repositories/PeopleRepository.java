package com.people.repositories;

import java.util.List;

import com.people.dto.WorkspaceDto;
import com.people.model.Person;
import com.people.model.Settings;
import com.people.model.Workspace;

public interface PeopleRepository extends Repository<Person> {
    void updatePosition(String id, String posX, String posY);

    List<Person> getPeopleTree(String workspaceId);

    Settings getSettings(String userId);

    List<Person> getChildren(String id);

    void deletePeople(List<Person> people);

    List<Person> getPersonByParentId(String id);

    void updatePeople(List<Person> firstChildren);

    void createWorkspace(Workspace toEntity);

    List<Workspace> getWorkspaces(String userId);
}
