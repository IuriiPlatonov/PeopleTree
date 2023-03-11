package com.people.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ObjectDto {
    private String userId;
    private String cardId;
    private String workspaceId;
//    private String card_set_id;
    private String elementId;
    private String elementIdentifier;
    private String posX;
    private String posY;
    private String posZ;
    private String parentId;
    private String value;
    private String height;
    private String width;

}
