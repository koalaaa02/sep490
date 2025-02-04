package com.example.sep490.entities;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private boolean isParent;

 // Quan hệ cha - con trong Category
    @ManyToOne
    @JoinColumn(name = "parent_id", nullable = true)
    private Category parentCategory; // Danh mục cha

    @ColumnDefault("false")
    @OneToMany(mappedBy = "parentCategory", cascade = CascadeType.ALL)
    private List<Category> subCategories = new ArrayList<>(); // Danh mục con
    
    @OneToMany(mappedBy = "category")
    private List<Product> products;
}

