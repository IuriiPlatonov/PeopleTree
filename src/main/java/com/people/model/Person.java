package com.people.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class Person {
	private String id;
	private String workspaceId;
	private String parentId;
	private String firstName;
	private String secondName;
	private String patronymic;
	private String age;
	private String email;
	private String address;
	private String posX;
	private String posY;
}
