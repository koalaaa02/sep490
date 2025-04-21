package com.example.sep490.controller.dealer;

import com.example.sep490.configs.jwt.UserInfoUserDetails;
import com.example.sep490.dto.ShopRequest;
import com.example.sep490.entity.enums.OrderStatus;
import com.example.sep490.repository.specifications.FilterDTO;
import com.example.sep490.repository.specifications.InvoiceFilterDTO;
import com.example.sep490.repository.specifications.OrderFilterDTO;
import com.example.sep490.service.InvoiceService;
import com.example.sep490.service.OrderDetailService;
import com.example.sep490.service.OrderService;
import com.example.sep490.service.ShopService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/dealer")
//@PreAuthorize("hasAnyAuthority('ROLE_DEALER')") //    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_PROVIDER')")
public class DealerController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private InvoiceService invoiceService;
    @Autowired
    private OrderDetailService orderDetailService;
    @Autowired
    private ShopService shopService;


    @GetMapping("/orders")
    public ResponseEntity<?> getMyOrders(OrderFilterDTO filter) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            return ResponseEntity.ok().body(orderService.getOrdersPublicFilter(filter));
        }
        return ResponseEntity.badRequest().body("No authenticated user");
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<?> getOrderByIdCustomer(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            return ResponseEntity.ok().body(orderService.getOrderByIdCustomer(id));
        }
        return ResponseEntity.badRequest().body("No authenticated user");
    }

//    @GetMapping("/invoices")
//    public ResponseEntity<?> getMyInvoices(InvoiceFilterDTO filter) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
//            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
//            return ResponseEntity.ok().body(invoiceService.getInvoicesByUserId(filter));
//        }
//        return ResponseEntity.badRequest().body("No authenticated user");
//    }

    @GetMapping("/ShopInvoiceSummary")
    public ResponseEntity<?> getShopInvoiceSummary(FilterDTO filter) {
        return ResponseEntity.ok(invoiceService.getShopsWithInvoices(filter));
    }

    @GetMapping("/GetInvoicesByShopId/{shopId}")
    public ResponseEntity<?> GetInvoicesOfAShop(@PathVariable Long shopId) {
        return ResponseEntity.ok(invoiceService.getShopsInvoicesByShopIdAndDealerId(shopId));
    }

    @GetMapping("/invoices/{id}")
    public ResponseEntity<?> getInvoiceById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            return ResponseEntity.ok().body(invoiceService.getInvoiceById(id));
        }
        return ResponseEntity.badRequest().body("No authenticated user");
    }
//    @PutMapping("/orders/{id}")
//    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PROVIDER', 'ROLE_DEALER')")
//    public ResponseEntity<?> setStatusOrder(@PathVariable Long id, OrderRequest orderRequest) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
//            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
//            return ResponseEntity.ok().body(orderService.updateOrderStatus(id,user.getId(),orderRequest));
//        }
//        return ResponseEntity.badRequest().body("No authenticated user");
//    }

    @GetMapping("/orderdetails/{id}")
    public ResponseEntity<?> getMyOrderDetailsByOrderId(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction,
            @PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserInfoUserDetails) {
            UserInfoUserDetails user = (UserInfoUserDetails) authentication.getPrincipal();
            return ResponseEntity.ok().body(
                    orderDetailService.getOrderDetailsByOrderId(page, size, sortBy, direction,id)
            );
        }
        return ResponseEntity.badRequest().body("No authenticated user");
    }

    @PutMapping("/change-status/{id}")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        orderService.changeOrderStatusForDealer(id, status);
        return ResponseEntity.ok("Cập nhật trạng thái đơn hàng thành công!");
    }

    @PostMapping(value = "/shop/create")
    public ResponseEntity<?> createShop(@Valid @RequestBody ShopRequest shopRequest) {
        return ResponseEntity.ok().body(shopService.createShop(shopRequest));
    }

    @PutMapping("/shop/update/{id}")
    public ResponseEntity<?> updateShop(@PathVariable Long id,@Valid @RequestBody ShopRequest shopRequest) {
        if (!id.equals(shopRequest.getId())) {
            return ResponseEntity.badRequest().body("id và id trong url không trùng khớp.");
        }
        return ResponseEntity.ok().body(shopService.updateShop(id, shopRequest));
    }

    public static class UpdateSecret {
        public Long shopId;
        public String password;
        public String vnp_TmnCode;
        public String vnp_HashSecret;
    }

    @PutMapping("/shop/updatesecretvnpay/{shopId}")
    public ResponseEntity<?> updateSecretVNPay(@PathVariable Long shopId,@Valid @RequestBody UpdateSecret updateSecret) {
        if (!shopId.equals(updateSecret.shopId)) {
            return ResponseEntity.badRequest().body("id và shopId trong url không trùng khớp.");
        }
        return ResponseEntity.ok().body(shopService.updateSecretVNPay(shopId, updateSecret.password, updateSecret.vnp_TmnCode, updateSecret.vnp_HashSecret));
    }

    @PostMapping(value = "/shop/uploadRegistrationCertificate", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadRegistrationCertificateImages(
            @RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok().body(shopService.uploadRegistrationCertificate(file)) ;
    }

    @PostMapping(value = "/shop/uploadLogoShop", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadLogoShop(
            @RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok().body(shopService.uploadLogoShop(file)) ;
    }
}
