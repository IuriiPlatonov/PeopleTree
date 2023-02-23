package com.people.dto.mapper;

import com.people.dto.WorkspaceDto;
import com.people.model.Workspace;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkspaceDtoMapper {

    public WorkspaceDto toDto(Workspace entity) {
        return WorkspaceDto.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .kindId(entity.getKindId())
                .build();
    }

    public List<WorkspaceDto> toDtos(List<Workspace> entities) {
        return entities.stream()
                .map(entity -> WorkspaceDto.builder()
                        .id(entity.getId())
                        .userId(entity.getUserId())
                        .kindId(entity.getKindId())
                        .build())
                .toList();
    }

    public Workspace toEntity(WorkspaceDto dto) {
        return Workspace.builder()
                .id(dto.getId())
                .userId(dto.getUserId())
                .kindId(dto.getKindId())
                .build();
    }
}
