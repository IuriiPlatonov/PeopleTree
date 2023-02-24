package com.people.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardDto {

	private String id;
	private String parentId;
	private String firstName;
	private String secondName;
	private String patronymic;
	private String age;
	private String email;
	private String address;
	private String posX;
	private String posY;
	private String workspaceId;
}
