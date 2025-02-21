package com.example.sep490.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.sep490.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    int countByname(String name);
    List<Product> findByNameLike(String name);
    List<Product> findByIdGreaterThan(int price);
    List<Product> findByName(String email);
    
    //tìm bản ghi của mình
//    @EntityGraph(attributePaths = {"category"})
    List<Product> findByCreatedByAndIsDeleteFalse(Long userId);
    Page<Product> findByCreatedByAndIsDeleteFalse(Long userId, Pageable pageable);

    //tìm theo id và là của mình
    Optional<Product> findByIdAndCreatedByAndIsDeleteFalse(Long id, Long createdBy);

    
    @Query(value = "SELECT * FROM product WHERE name = :name", nativeQuery = true)
    Optional<Product> findByNames(@Param("name") String name);


    Page<Product> findByNameContainingIgnoreCaseAndIsDeleteFalse(String name, Pageable pageable);
    Page<Product> findByIsDeleteFalse(Pageable pageable);
    Optional<Product> findByIdAndIsDeleteFalse(Long id);
}

//By: Được sử dụng để nối với tên trường trong entity.
//And / Or: Kết hợp nhiều điều kiện tìm kiếm.
//Like: Tìm kiếm với mẫu (thường được sử dụng với chuỗi).
//Not: Phủ định điều kiện (tương tự như NOT trong SQL).
//GreaterThan / LessThan: So sánh lớn hơn hoặc nhỏ hơn.
//In / NotIn: Kiểm tra giá trị có thuộc trong một tập hợp hay không.
//GreaterThanEqual - Lớn hơn hoặc bằng.
//LessThanEqual - Nhỏ hơn hoặc bằng.
//Between - Kiểm tra giá trị trong một khoảng.
//IsNull / IsNotNull - Kiểm tra giá trị null hay không null.