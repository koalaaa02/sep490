package com.example.sep490.repository.specifications;

import com.example.sep490.entity.enums.InvoiceStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvoiceFilterDTO {
    @Schema(defaultValue = "1")
    private int page = 1;
    @Schema(defaultValue = "10")
    private int size = 10;
    @Schema(defaultValue = "id")
    private String sortBy = "id";
    @Schema(defaultValue = "ASC")
    private String direction = "ASC";

    private String agentName;
    @Schema(defaultValue = "UNPAID")
    private InvoiceStatus status;
    private Long agentId;
    @JsonIgnore
    private Long createdBy;

}

