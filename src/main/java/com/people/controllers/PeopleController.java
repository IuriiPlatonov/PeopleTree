package com.people.controllers;

import com.people.dto.*;
import com.people.dto.response.DeleteParentResponse;
import com.people.services.PeopleService;
import com.people.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("api/")
@RequiredArgsConstructor
public class PeopleController {

    private final PeopleService peopleService;
    private final UserService userService;

    @GetMapping("people")
    public ResponseEntity<List<PersonDto>> getPeople(/*@RequestParam("userId") String userId*/Principal principal) {
        UserDto user = userService.getByEmail(principal.getName());
        return ResponseEntity.ok(peopleService.getPeople(user.getId()));
    }

    @PostMapping("savePositions")
    @PreAuthorize("hasAuthority('user:write')")
    public ResponseEntity<Void> updateCardPositions(@RequestBody PositionDto position) {
        peopleService.updateCardPosition(position);
        return ResponseEntity.ok().body(null);
    }

    @PostMapping("delete")
    public ResponseEntity<List<PersonDto>> delete(@RequestBody PersonDto person) {
        return ResponseEntity.ok().body(peopleService.delete(person));
    }

    @PostMapping("deleteParent")
    public ResponseEntity<DeleteParentResponse> deleteParent(@RequestBody PersonDto person) {
        return ResponseEntity.ok().body(peopleService.deleteParent(person));
    }

    @PostMapping("update")
    public ResponseEntity<Void> update(@RequestBody PersonDto person) {
        peopleService.update(person);
        return ResponseEntity.ok().body(null);
    }

    @PostMapping("create")
    public ResponseEntity<PersonDto> create(@RequestBody PersonDto person) {
        return ResponseEntity.ok(peopleService.create(person));
    }

    @GetMapping("settings")
    public ResponseEntity<SettingsDto> getSettings() {
        return ResponseEntity.ok(peopleService.getSettings("1"));
    }

    @GetMapping("childrenCount")
    public ResponseEntity<DefaultBean> getChildrenCount(@RequestParam("personId") String personId) {
        return ResponseEntity.ok(peopleService.getChildrenCount(personId));
    }
}
