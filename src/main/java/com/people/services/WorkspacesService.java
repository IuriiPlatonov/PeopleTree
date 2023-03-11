package com.people.services;

import com.people.dto.ObjectDto;

import java.security.Principal;
import java.util.List;
import java.util.Map;

public interface WorkspacesService {
    Map<String, List<ObjectDto>> createWorkspace(ObjectDto object, Principal principal);

    List<ObjectDto> getWorkspacesForUser(String userId);

    Map<String, List<ObjectDto>> getWorkspacesByUserEmail(String email);
}
