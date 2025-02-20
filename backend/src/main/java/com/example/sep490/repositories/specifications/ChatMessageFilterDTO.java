package com.example.sep490.repositories.specifications;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageFilterDTO {
    @Schema(defaultValue = "1")
    private int page = 1;
    @Schema(defaultValue = "50")
    private int size = 50;
    @Schema(defaultValue = "timestamp")
    private String sortBy = "timestamp";
    @Schema(defaultValue = "DESC")
    private String direction = "DESC";

    @NotNull
    private Long chatRoomId;
}

