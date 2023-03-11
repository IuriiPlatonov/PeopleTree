package com.people.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardObject {
    private String userId;
    private String cardId;
    private String workspaceId;
    private String cardSetId;
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
