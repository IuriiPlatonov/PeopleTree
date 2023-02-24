package com.people.services.impl;

import com.people.dto.CardDto;
import com.people.dto.WorkspaceDto;
import com.people.dto.request.AuthRequest;
import com.people.dto.request.CheckRegFieldRequest;
import com.people.dto.request.RegisterRequest;
import com.people.dto.response.AuthResponse;
import com.people.dto.response.RegisterResponse;
import com.people.enums.FieldType;
import com.people.enums.Role;
import com.people.model.User;
import com.people.repositories.UserRepository;
import com.people.services.AuthService;
import com.people.services.CardService;
import com.people.services.WorkspacesService;
import com.people.utils.RandomGUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final String NAME_REGEX = "[0-9a-zA-Zа-яА-Я_]{3,}";
    private static final String EMAIL_REGEX = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"" +
            "(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])" +
            "*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4]" +
            "[0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*" +
            "[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])";
    private static final String PASSWORD_REGEX = "(?=.*[0-9])(?=.*[!@#$%^*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^*]{6,}";

    private final UserRepository userRepository;
    private final CardService cardService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final WorkspacesService workspacesService;

    @Override
    public RegisterResponse checkValid(CheckRegFieldRequest request) {
        FieldType type = FieldType.getBySuffix(request.getFieldName());
        return switch (type) {
            case NAME -> checkField(request.getText(), NAME_REGEX, "Минимальная длина 3 символа");
            case EMAIL -> checkEmailField(request.getText());
            case PASSWORD -> checkField(request.getText(), PASSWORD_REGEX, "Пароль должен содержать " +
                    "латинские строчные и заглавные буквы, цифры, спец. символы !@#$%^*, минимальная длина 6 знаков");
        };
    }

    @Override
    public RegisterResponse register(RegisterRequest request) {

        var user = createUser(User.builder()
                .firstName(request.getFirstname())
                .lastName(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build());

        login(new AuthRequest(request.getEmail(), request.getPassword()));

        var workspace = workspacesService.createWorkspace(WorkspaceDto.builder()
                .userId(user.getId())
                .build());

        cardService.create(CardDto.builder()
                .workspaceId(workspace.getId())
                .firstName(user.getFirstName())
                .secondName(user.getLastName())
                .patronymic(user.getPatronymic())
                .email(user.getEmail())
                .build());
        return RegisterResponse.builder().build();
    }

    private User createUser(User user) {
        String id = RandomGUID.newValue();
        user.setId(id);
        userRepository.create(user);
        return user;
    }

    @Override
    public AuthResponse login(AuthRequest authRequest) {
        var token = new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword());
        Authentication auth = authManager.authenticate(token);
        SecurityContext securityContext = SecurityContextHolder.getContext();
        securityContext.setAuthentication(auth);

        var userDetail = (org.springframework.security.core.userdetails.User) auth.getPrincipal();
        final User user = userRepository.findByEmail(userDetail.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));

        return AuthResponse.builder().isAuthorized(true).build();
    }

    private RegisterResponse checkField(String text, String regex, String message) {
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(text);
        boolean isMatches = matcher.matches();
        return new RegisterResponse(isMatches, !isMatches ? message : "");
    }

    private RegisterResponse checkEmailField(String text) {
        Pattern pattern = Pattern.compile(EMAIL_REGEX);
        Matcher matcher = pattern.matcher(text);
        boolean isMatches = matcher.matches();
        boolean isExist = isMatches && userRepository.findByEmail(text).isPresent();

        return new RegisterResponse(isMatches && !isExist,
                !isMatches ? "Это не почта" : isExist ? "Пользователь с таким email уже зарегестрирован" : "");
    }

}
