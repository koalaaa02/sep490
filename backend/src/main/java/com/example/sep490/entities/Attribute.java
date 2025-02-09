package com.example.sep490.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//@Entity
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class Attribute extends Auditable{//thuộc tính sản phẩm Color, Size, Chất liệu, ....
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false, length = 255)
//    @Size(max = 255, message = "Tên không được dài quá 255 ký tự")
//    @NotBlank(message = "Tên không được để trống")
//    private String attributeName;
//
//    @OneToMany(mappedBy = "attribute")
//    private List<AttributeValue> attributeValues;
//}
