package com.example.sep490.entities.enums;

public enum ExpenseType {
    RESTOCKING , //Chi phí nhập hàng.
    SHIPPING, //  Chi phí liên quan đến việc vận chuyển hàng hóa từ kho đến tay khách hàng.
    SALARIES, //Chi phí liên quan đến việc trả lương cho nhân viên.
    OPERATION, // Chi phí vận hành
    MAINTENANCE, //Chi phí bảo trì và sửa chữa thiết bị, cơ sở vật chất.
    OTHER // Chi phí khác
}  

//@GetMapping("/expense-types")
//public List<String> getExpenseTypes() {
//    return Arrays.stream(ExpenseType.values())
//                 .map(Enum::name) // Lấy tên enum dưới dạng chuỗi
//                 .collect(Collectors.toList());
//}