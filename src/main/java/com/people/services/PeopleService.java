package com.people.services;

import java.util.List;
import java.util.Map;

import com.people.dto.DefaultBean;
import com.people.dto.PersonDto;
import com.people.dto.PositionDto;
import com.people.dto.SettingsDto;
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
}
