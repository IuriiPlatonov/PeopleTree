package com.people.services;

import com.people.dto.request.AuthRequest;
import com.people.dto.request.CheckRegFieldRequest;
import com.people.dto.request.RegisterRequest;
import com.people.dto.response.AuthResponse;
import com.people.dto.response.RegisterResponse;

public interface AuthService {
    RegisterResponse register(RegisterRequest request);

    AuthResponse login(AuthRequest authRequest);

    RegisterResponse checkValid(CheckRegFieldRequest request);
}
