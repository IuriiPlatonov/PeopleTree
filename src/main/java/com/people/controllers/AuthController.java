package com.people.controllers;

import com.people.dto.request.AuthRequest;
import com.people.dto.request.CheckRegFieldRequest;
import com.people.dto.request.RegisterRequest;
import com.people.dto.response.AuthResponse;
import com.people.dto.response.RegisterResponse;
import com.people.services.AuthService;
import com.people.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Slf4j
@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @GetMapping("checkAuth")
    public ResponseEntity<AuthResponse> checkAuth(Principal principal) {
        boolean isAuthorized = principal != null;
        String userId = isAuthorized
                ? userService.getByEmail(principal.getName()).getId()
                : "";
        Object po = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok().body(
                AuthResponse.builder()
                        .isAuthorized(isAuthorized)
                        .userId(userId)
                        .build());

    }

    @PostMapping("login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok().body(authService.login(request));
    }

    @PostMapping("registration")
    public ResponseEntity<RegisterResponse> registration(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok().body(authService.register(request));
    }

    @PostMapping("checkValid")
    public ResponseEntity<RegisterResponse> checkValid(@RequestBody CheckRegFieldRequest request) {
        log.info("Check {}", request.getText());
        return ResponseEntity.ok().body(authService.checkValid(request));
    }
}
