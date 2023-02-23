package com.people.services;

import com.people.dto.UserDto;

public interface UserService {

    UserDto getByEmail(String email);
}
