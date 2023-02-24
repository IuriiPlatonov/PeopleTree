package com.people.dto.response;

import java.util.List;

import com.people.dto.CardDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeleteParentResponse {
    private CardDto parent;
    private List<CardDto> children;
}
