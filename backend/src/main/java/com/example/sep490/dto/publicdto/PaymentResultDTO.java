package com.example.sep490.dto.publicdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PaymentResultDTO {
    String vnp_Amount ;
    String vnp_BankCode ;
    String vnp_BankTranNo ;
    String vnp_CardType ;
    String vnp_OrderInfo ;
    String vnp_PayDate  ;
    String vnp_TransactionNo ;
}
