package com.people.enums;

public enum Permission {
    USER("user:write"),
    MODERATOR("user:moderate"),
    ADMIN("user:admin");

    private final String permission;

    Permission(String permission) {
        this.permission = permission;
    }

    public String getPermission() {
        return permission;
    }
}
