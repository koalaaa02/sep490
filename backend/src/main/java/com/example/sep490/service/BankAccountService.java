package com.example.sep490.service;

import com.example.sep490.dto.BankAccountRequest;
import com.example.sep490.dto.BankAccountResponse;
import com.example.sep490.entity.BankAccount;
import com.example.sep490.entity.Shop;
import com.example.sep490.entity.User;
import com.example.sep490.mapper.BankAccountMapper;
import com.example.sep490.repository.BankAccountRepository;
import com.example.sep490.repository.ShopRepository;
import com.example.sep490.repository.UserRepository;
import com.example.sep490.repository.specifications.BankAccountFilterDTO;
import com.example.sep490.repository.specifications.BankAccountSpecification;
import com.example.sep490.utils.BasePagination;
import com.example.sep490.utils.PageResponse;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;
import java.util.Optional;

@Service
public class BankAccountService {
    @Autowired
    private BankAccountRepository bankAccountRepo;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private BankAccountMapper bankAccountMapper;
    @Autowired
    private BasePagination pagination;
    @Autowired
    private UserService userService;

    public PageResponse<BankAccountResponse> getBankAccounts(BankAccountFilterDTO filter) {
        filter.setCreatedBy(userService.getContextUser().getId());
        Specification<BankAccount> spec = BankAccountSpecification.filterBankAccounts(filter);
        Pageable pageable = pagination.createPageRequest(filter.getPage(), filter.getSize(), filter.getSortBy(), filter.getDirection());
        Page<BankAccount> bankAccountPage = bankAccountRepo.findAll(spec, pageable);
        Page<BankAccountResponse> bankAccountResponsePage = bankAccountPage.map(bankAccountMapper::EntityToResponse);
        return pagination.createPageResponse(bankAccountResponsePage);
    }

    public BankAccountResponse getBankAccountById(Long id) {
        Optional<BankAccount> BankAccount = bankAccountRepo.findByIdAndIsDeleteFalse(id);
        if (BankAccount.isPresent()) {
            return bankAccountMapper.EntityToResponse(BankAccount.get());
        } else {
            throw new RuntimeException("Danh mục không tồn tại với ID: " + id);
        }
    }

    @Transactional
    public BankAccountResponse createBankAccount(BankAccountRequest bankAccountRequest) {
        Long checkUserId = userService.getContextUser().getId();
        BankAccount entity = bankAccountMapper.RequestToEntity(bankAccountRequest);
        if(bankAccountRequest.isDefaultBankAccount()){
            bankAccountRepo.resetDefaultBankAccountForUser(userService.getContextUser().getId());
        }
        return bankAccountMapper.EntityToResponse(bankAccountRepo.save(entity));
    }

    @Transactional
    public BankAccountResponse updateBankAccount(Long id, BankAccountRequest bankAccountRequest) {
        Long checkUserId = userService.getContextUser().getId();
        BankAccount bankAccount = bankAccountRepo.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại với ID: " + id));
        if(!Objects.equals(checkUserId, bankAccount.getCreatedBy()))
            throw new ResponseStatusException(HttpStatusCode.valueOf(400), "Bạn không có quyền sửa tài khoản này.");

        try {
            objectMapper.updateValue(bankAccount, bankAccountRequest);
        } catch (JsonMappingException e) {
            throw new RuntimeException("Dữ liệu gửi đi không đúng định dạng.");
        }

        if(bankAccountRequest.isDefaultBankAccount()){
            bankAccountRepo.resetDefaultBankAccountForUser(userService.getContextUser().getId());
        }
        return bankAccountMapper.EntityToResponse(bankAccountRepo.save(bankAccount));
    }

    @Transactional
    public void setDefaultBankAccount(Long bankAccountId) {
        Long checkUserId = userService.getContextUser().getId();
        bankAccountRepo.resetDefaultBankAccountForUser(checkUserId);

        BankAccount bankAccount = bankAccountRepo.findByIdAndIsDeleteFalse(bankAccountId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        bankAccount.setDefaultBankAccount(true);
        bankAccountRepo.save(bankAccount);
    }


    public void deleteBankAccount(Long id) {
        BankAccount updatedBankAccount = bankAccountRepo.findByIdAndIsDeleteFalse(id)
                .map(existingBankAccount -> {
                    existingBankAccount.setDelete(true);
                    return bankAccountRepo.save(existingBankAccount);
                })
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại với ID: " + id));
    }

    private BankAccount getBankAccount(Long id) {
        return id == null ? null
                : bankAccountRepo.findByIdAndIsDeleteFalse(id).orElse(null);
    }

}