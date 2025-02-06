package com.example.sep490.entities;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shop  extends Auditable{//Shop mà admin tạo cho user(sau đó được cập nhật role seller)

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // Tên shop

    @OneToMany(mappedBy = "shop")
    private List<Order> orders; // Một shop có thể có nhiều đơn hàng

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false) 
    private User manager; // Một shop có một người quản lý
    
    private String secretA; 
    private String secretB; 

}
