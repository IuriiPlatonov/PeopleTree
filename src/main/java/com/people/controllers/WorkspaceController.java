package com.people.controllers;

import com.people.dto.ObjectDto;
import com.people.services.WorkspacesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspacesService workspacesService;

    @GetMapping("workspaces")
    public ResponseEntity<Map<String, List<ObjectDto>>> getWorkspaces(Principal principal) {
        return ResponseEntity.ok(workspacesService.getWorkspacesByUserEmail(principal.getName()));
    }
}
