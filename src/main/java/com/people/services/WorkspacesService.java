package com.people.services;

import com.people.dto.WorkspaceDto;

import java.util.List;

public interface WorkspacesService {
    WorkspaceDto createWorkspace(WorkspaceDto workspace);

    List<WorkspaceDto> getWorkspacesForUser(String userId);
}
