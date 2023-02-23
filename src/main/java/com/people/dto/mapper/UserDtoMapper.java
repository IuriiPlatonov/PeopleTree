package com.people.dto.mapper;

import com.people.dto.UserDto;
import com.people.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserDtoMapper {
    public UserDto toDto(User entity) {
        return UserDto.builder().id(entity.getId()).firstName(entity.getFirstName())
                .lastName(entity.getLastName()).patronymic(entity.getPatronymic()).email(entity.getEmail())
                .age(entity.getAge())
                .build();
    }
}
