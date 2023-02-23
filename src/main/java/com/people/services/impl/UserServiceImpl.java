package com.people.services.impl;

import com.people.dto.UserDto;
import com.people.dto.mapper.UserDtoMapper;
import com.people.model.User;
import com.people.repositories.UserRepository;
import com.people.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserDtoMapper userDtoMapper;

    @Override
    public UserDto getByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return userDtoMapper.toDto(user);
    }
}
