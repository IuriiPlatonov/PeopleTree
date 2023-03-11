package com.people.controllers;

import com.people.dto.*;
import com.people.dto.response.DeleteParentResponse;
import com.people.services.CardService;
import com.people.services.UserService;
import com.people.services.WorkspacesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;
    private final UserService userService;
    private final WorkspacesService workspacesService;

    @PostMapping("cards")
    public ResponseEntity<Map<String, List<ObjectDto>>> getCards(@RequestBody ObjectDto object, Principal principal) {
        return ResponseEntity.ok(cardService.getCards(object.getWorkspaceId(), principal));
    }

    @GetMapping("cardPatterns")
    public ResponseEntity<Map<String, List<ObjectDto>>> getCardPatterns(Principal principal) {
        return ResponseEntity.ok(cardService.getCardPatterns(principal));
    }

    @PostMapping("createCard")
    public ResponseEntity<Map<String, List<ObjectDto>>> createCard(@RequestBody ObjectDto object, Principal principal) {
        return ResponseEntity.ok().body(cardService.createCard(object, principal));
    }

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

    @PostMapping("savePosition")
    @PreAuthorize("hasAuthority('user:write')")
    public ResponseEntity<Void> updateCardPosition(@RequestBody PositionDto position) {
        cardService.updateCardPositionV2(position);
        return ResponseEntity.ok().body(null);
    }

    @PostMapping("delete")
    public ResponseEntity<List<CardDto>> delete(@RequestBody CardDto person) {
        return ResponseEntity.ok().body(cardService.delete(person));
    }

    @PostMapping("deleteCard")
    public ResponseEntity<List<ObjectDto>> deleteCard(@RequestBody ObjectDto card) {
        return ResponseEntity.ok().body(cardService.deleteCard(card));
    }

    @PostMapping("deleteWorkspace")
    public ResponseEntity<List<ObjectDto>> deleteWorkspace(@RequestBody ObjectDto workspace) {
        return ResponseEntity.ok().body(cardService.deleteWorkspace(workspace));
    }

    @PostMapping("changeParent")
    public ResponseEntity<DeleteParentResponse> changeParent(@RequestBody ObjectDto card) {
        return ResponseEntity.ok().body(cardService.changeParent(card));
    }

    @PostMapping("saveTextValue")
    public ResponseEntity<Void> saveTextValue(@RequestBody ObjectDto card) {
        cardService.saveTextValue(card);
        return ResponseEntity.ok().body(null);
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

    @GetMapping("cardChildrenCount")
    public ResponseEntity<DefaultBean> getCardChildrenCount(@RequestParam("cardId") String cardId) {
        return ResponseEntity.ok(cardService.getCardChildrenCount(cardId));
    }

}
