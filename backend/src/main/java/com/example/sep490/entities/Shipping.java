package com.example.sep490.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
//
//@Entity
//public class Shipping {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String provider;
//    private String trackingNumber;
//
//    @OneToOne
//    @JoinColumn(name = "order_id")
//    private Order order;
//}
