package com.people.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class Settings {
    private String id;
    private String userId;
    private String theme;
    private String screenScale;
}