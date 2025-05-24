package com.example.sep490.repository.specifications;

import com.example.sep490.entity.enums.PaymentType;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TransactionFilterDTO {
    @Schema(defaultValue = "1")
    private int page = 1;
    @Schema(defaultValue = "10")
    private int size = 10;
    @Schema(defaultValue = "id")
    private String sortBy = "id";
    @Schema(defaultValue = "ASC")
    private String direction = "ASC";

    @Schema(description = "Filter from this date (format: yyyy-MM-dd HH:mm:ss)")
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fromDate;
    @Schema(description = "Filter until this date (format: yyyy-MM-dd HH:mm:ss)")
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime toDate;

    private Long shopId;

    @JsonIgnore
    private Long createdBy;

    private PaymentType paymentType;

}

