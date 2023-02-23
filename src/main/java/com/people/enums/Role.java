package com.people.enums;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Set;
import java.util.stream.Collectors;

public enum Role {
    USER(Set.of(Permission.USER)),
    MODERATOR(Set.of(Permission.USER, Permission.MODERATOR)),
    ADMIN(Set.of(Permission.USER, Permission.MODERATOR, Permission.ADMIN));

    private Set<Permission> permissions;

    Role(Set<Permission> permissions) {
        this.permissions = permissions;
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }

    public static Role getBySuffix(String value) {
        return switch (value) {
            case "ADMIN" -> ADMIN;
            case "MODERATOR" -> MODERATOR;
            default -> USER;
        };
    }

    public Set<SimpleGrantedAuthority> getAuthorities() {
        return permissions.stream()
                .map(p -> new SimpleGrantedAuthority(p.getPermission()))
                .collect(Collectors.toSet());
    }
}
