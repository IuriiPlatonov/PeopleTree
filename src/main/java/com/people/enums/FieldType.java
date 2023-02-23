package com.people.enums;

public enum FieldType {
    NAME("name"),
    EMAIL("email"),
    PASSWORD("password");

    private String value;

    FieldType(String value) {
        this.value = value;
    }

    public static FieldType getBySuffix(String value) {
        return switch (value) {
            case "name" -> NAME;
            case "email" -> EMAIL;
            default -> PASSWORD;
        };
    }

    public String getValue() {
        return value;
    }
}
