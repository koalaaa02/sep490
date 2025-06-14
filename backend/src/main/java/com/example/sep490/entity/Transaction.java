package com.example.sep490.entity;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.sep490.entity.enums.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_transaction")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction  extends Auditable{//lưu thông tin dòng tiền vào, được thanh toán online

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String bankCode;
    private String content; //nội dung chuyển khoản
    private String transactionId; // Mã giao dịch từ VNPAY/...

    @Column(nullable = false)
    private BigDecimal amount;  // số tiền
    private LocalDateTime paymentDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentProvider paymentProvider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentType paymentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    // Relationship
    @OneToOne
    @JoinColumn(name = "order_id", nullable = true)
    private Order order;

    @OneToOne
    @JoinColumn(name = "debtPayment_id", nullable = true)
    private DebtPayment debtPayment;

    @Column(nullable = true)
    private Long shopId;
    @Column(nullable = true)
    private Long invoiceId;
}
//String vnp_Amount ;
//String vnp_BankCode ;
//String vnp_BankTranNo ;
//String vnp_CardType ;
//String vnp_OrderInfo ;
//String vnp_PayDate  ;
//String vnp_TransactionNo ;
