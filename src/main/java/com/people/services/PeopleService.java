package com.people.services;

import java.util.List;
import java.util.Map;

import com.people.dto.*;
import com.people.dto.response.DeleteParentResponse;

public interface PeopleService {

    void updateCardPosition(PositionDto position);

    List<PersonDto> getPeople(String userId);

    List<PersonDto> delete(PersonDto person);

    void update(PersonDto person);

    PersonDto create(PersonDto person);

    SettingsDto getSettings(String userId);

    DefaultBean getChildrenCount(String personId);

    DeleteParentResponse deleteParent(PersonDto person);

    WorkspaceDto createWorkspace(WorkspaceDto workspace);

    List<WorkspaceDto> getWorkspacesForUser(String userId);
}
