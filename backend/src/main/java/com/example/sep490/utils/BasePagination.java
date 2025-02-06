package com.example.sep490.utils;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class BasePagination {

    public Pageable createPageRequest(int page, int size, String sortBy, String direction) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        return PageRequest.of(page-1, size, sort);
    }

    public <T> PageResponse<T> createPageResponse(Page<T> pageData) {
        return new PageResponse<>(
            pageData.getContent(),
            pageData.getNumber(),
            pageData.getSize(),
            pageData.getTotalElements(),
            pageData.getTotalPages(),
            pageData.isFirst(),
            pageData.isLast()
        );
    }
}
