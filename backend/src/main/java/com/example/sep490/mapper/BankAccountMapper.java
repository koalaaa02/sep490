package com.example.sep490.mapper;

import com.example.sep490.dto.BankAccountRequest;
import com.example.sep490.dto.BankAccountResponse;
import com.example.sep490.dto.BankAccountResponse;
import com.example.sep490.entity.BankAccount;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BankAccountMapper {
    @Mapping(source = "id", target = "id")
    BankAccountResponse EntityToResponse(BankAccount bankAccount);

    @Mapping(source = "id", target = "id")
    List<BankAccountResponse> entityToResponses(List<BankAccount> bankAccount);
    
    @Mapping(source = "id", target = "id")
    BankAccount RequestToEntity(BankAccountRequest bankAccountRequest);
    
    @Mapping(source = "id", target = "id")
    List<BankAccount> RequestsToentity(List<BankAccountRequest> bankAccountRequest);
}
