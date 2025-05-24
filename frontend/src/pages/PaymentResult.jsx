import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const result = queryParams.get("result");
  const amount = queryParams.get("vnp_Amount");
  const returnTo = queryParams.get("returnTo") || "/MyDebt";

  const handleConfirm = () => {
    navigate(returnTo);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#f2f2f2" }}
    >
      <div
        className="bg-white p-5 rounded shadow text-center"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        {result === "success" ? (
          <>
            <h4 className="mb-3">Thanh toán thành công!</h4>
            <FaCheckCircle size={60} color="#0d6efd" className="mb-3" />
            <p className="mb-1">
              <strong>Khoản nợ đã được thanh toán</strong>
            </p>
            <p className="mb-4">
              Số tiền thanh toán:{" "}
              <strong>{parseInt(amount).toLocaleString("vi-VN")} VNĐ</strong>
            </p>
          </>
        ) : (
          <>
            <h4 className="mb-3 text-danger">Thanh toán thất bại</h4>
            <FaTimesCircle size={60} color="red" className="mb-3" />
            <p className="mb-4">
              Đã có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.
            </p>
          </>
        )}
        <button className="btn btn-primary w-100" onClick={handleConfirm}>
          Xác nhận
        </button>
      </div>
    </div>
  );
};

export default PaymentResult;
