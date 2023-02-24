package com.people.services.impl;

import com.people.dto.WorkspaceDto;
import com.people.dto.mapper.WorkspaceDtoMapper;
import com.people.repositories.WorkspacesRepository;
import com.people.services.WorkspacesService;
import com.people.utils.RandomGUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkspacesServiceImpl implements WorkspacesService {

    private final WorkspacesRepository workspacesRepository;

    private final WorkspaceDtoMapper workspaceDtoMapper;
    @Override
    public List<WorkspaceDto> getWorkspacesForUser(String userId) {
        return workspaceDtoMapper.toDtos(workspacesRepository.getWorkspacesByUserId(userId));
    }

    @Override
    public WorkspaceDto createWorkspace(WorkspaceDto workspace) {
        String id = RandomGUID.newValue();
        workspace.setId(id);
        workspacesRepository.create(workspaceDtoMapper.toEntity(workspace));
        return workspace;
    }
}
