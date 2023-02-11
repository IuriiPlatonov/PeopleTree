package com.people.dto.response;

import java.util.List;

import com.people.dto.PersonDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeleteParentResponse {
    private PersonDto parent;
    private List<PersonDto> children;
}
