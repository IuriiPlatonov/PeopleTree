package com.people.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.people.dto.PersonDto;
import com.people.dto.PositionDto;
import com.people.services.PeopleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/")
@RequiredArgsConstructor
public class PeopleController {

	private final PeopleService peopleService;
	
	@GetMapping("people")
	public ResponseEntity<List<PersonDto>> getPeople() {
		return ResponseEntity.ok(peopleService.getPeople());
	}
	
	@PostMapping("savePositions")
	public ResponseEntity<Void> updateCardPositions(@RequestBody PositionDto position) {
		peopleService.updateCardPosition(position);
		return ResponseEntity.ok().body(null);
	}
	
	@PostMapping("delete")
	public ResponseEntity<Void> delete(@RequestBody PersonDto person) {
	//	peopleService.deleteCard(person);
		System.out.println("Удалил");
		return ResponseEntity.ok().body(null);
	}
	
	@PostMapping("update")
	public ResponseEntity<Void> update(@RequestBody PersonDto person) {
		peopleService.update(person);
		return ResponseEntity.ok().body(null);
	}
	
	@PostMapping("create")
	public ResponseEntity<Void> create(@RequestBody PersonDto person) {
	//	peopleService.deleteCard(person);
		System.out.println("создал" + person.getAge() + person.getParentId());
		return ResponseEntity.ok().body(null);
	}
}
