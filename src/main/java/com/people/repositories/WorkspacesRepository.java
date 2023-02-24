package com.people.repositories;

import com.people.model.Workspace;

import java.util.List;

public interface WorkspacesRepository extends Repository<Workspace>{

    List<Workspace> getWorkspacesByUserId(String userId);
}
