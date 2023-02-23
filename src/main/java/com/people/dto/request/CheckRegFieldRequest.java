package com.people.dto.request;

import lombok.Data;

@Data
public class CheckRegFieldRequest {
    private String text;
    private String fieldName;
}
