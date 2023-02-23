package com.people.dto.request;

import lombok.Data;

@Data
public class RegisterRequest {

    private String firstname;
    private String lastname;
    private String patronymic;
    private String email;
    private String password;
    private String confirmPassword;

}
