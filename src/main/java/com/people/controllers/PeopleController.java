package com.people.controllers;

import com.people.dto.*;
import com.people.dto.response.DeleteParentResponse;
import com.people.services.CardService;
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

    private final CardService cardService;
    private final UserService userService;

    @GetMapping("people")
    public ResponseEntity<List<CardDto>> getPeople(/*@RequestParam("userId") String userId*/Principal principal) {
        UserDto user = userService.getByEmail(principal.getName());
        return ResponseEntity.ok(cardService.getCards(user.getId()));
    }

    @PostMapping("savePositions")
    @PreAuthorize("hasAuthority('user:write')")
    public ResponseEntity<Void> updateCardPositions(@RequestBody PositionDto position) {
        cardService.updateCardPosition(position);
        return ResponseEntity.ok().body(null);
    }

    @PostMapping("delete")
    public ResponseEntity<List<CardDto>> delete(@RequestBody CardDto person) {
        return ResponseEntity.ok().body(cardService.delete(person));
    }

    @PostMapping("deleteParent")
    public ResponseEntity<DeleteParentResponse> deleteParent(@RequestBody CardDto person) {
        return ResponseEntity.ok().body(cardService.deleteParent(person));
    }

    @PostMapping("update")
    public ResponseEntity<Void> update(@RequestBody CardDto person) {
        cardService.update(person);
        return ResponseEntity.ok().body(null);
    }

    @PostMapping("create")
    public ResponseEntity<CardDto> create(@RequestBody CardDto person) {
        return ResponseEntity.ok(cardService.create(person));
    }

    @GetMapping("childrenCount")
    public ResponseEntity<DefaultBean> getChildrenCount(@RequestParam("personId") String personId) {
        return ResponseEntity.ok(cardService.getChildrenCount(personId));
    }
}
