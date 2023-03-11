package com.people.repositories;

import com.people.model.CardObject;

import java.util.List;

public interface WorkspacesRepository extends Repository<CardObject>{

    List<CardObject> getWorkspacesByUserId(String userId);
}
