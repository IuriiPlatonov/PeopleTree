package com.people.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.people.dto.response.AuthResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

    // private final AuthService authService;

    @GetMapping("checkAuth")
    public ResponseEntity<AuthResponse> checkAuth(@CookieValue(value = "token", defaultValue = "") String username) {
	// authService.updateCardPosition(position);

	return ResponseEntity.ok().body(AuthResponse.builder().isAuthorized(false).userId("1").build());
    }
}
