import React, { useState } from "react";
import { BASE_URL } from "../../../Utils/config";
import { Modal, Button } from "react-bootstrap";
import dayjs from "dayjs";

const AddPayment = ({ orderData, closeAddPayment, onPaymentCreated }) => {
  const [paymentData, setPaymentData] = useState({
    invoiceId: orderData?.invoice?.id,
    amountPaid: 0,
    paymentDate: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
  });

  const token = localStorage.getItem("access_token");
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);
  const handleConfirmSubmit = async () => {
    if (Number(paymentData.amountPaid) <= 0) {
      setError("Số tiền phải lớn hơn 0.");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/provider/debt-payments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error("Có lỗi khi tạo phiếu thanh toán");
      }
      if (typeof onInvoiceCreated === "function") {
        await onPaymentCreated();
      }
      setShowConfirm(false);

      alert("Tạo phiếu thanh toán thành công!");
      closeAddPayment();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleConfirm = () => {
    setShowConfirm(true);
  };
  const handleAmountChange = (e) => {
    setPaymentData({ ...paymentData, amountPaid: e.target.value });
  };

  return (
    <div className="p-3 mb-10 container">
      <h4>Thêm phiếu giao dịch</h4>
      <form>
        <div className="border p-3 mb-3">
          <h5>Thông tin</h5>
          <div className="row">
            <div className="col-md-6 mb-2">
              <strong className="me-2">Mã hóa đơn:</strong>
              <span>{orderData.orderCode}</span>
            </div>
            <div className="row mb-2">
              <div className="col-md-5 d-flex align-items-center">
                <strong style={{ minWidth: "120px" }}>Người trả tiền:</strong>
                <input
                  type="text"
                  name="customer"
                  className="form-control"
                  value={orderData.address.recipientName}
                  readOnly
                />
              </div>
              <div className="col-md-7 d-flex align-items-center">
                <strong className="me-2" style={{ minWidth: "160px" }}>
                  Ngày giao dịch:
                </strong>
                <input
                  type="date"
                  name="paymentDate"
                  className="form-control"
                  value={paymentData.paymentDate.substring(0, 10)}
                  required
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      paymentDate: `${e.target.value}T00:00:00`,
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-6 mb-2 d-flex align-items-center">
              <strong style={{ minWidth: "200px" }}>
                Số điện thoại người trả:
              </strong>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={orderData.address.phone}
                readOnly
              />
            </div>
            <div className="col-md-12 mb-2 d-flex align-items-center">
              <strong style={{ minWidth: "200px" }}>Nhập số tiền trả:</strong>
              <input
                type="number"
                name="amountPaid"
                className="form-control"
                value={paymentData.amountPaid}
                onChange={handleAmountChange}
                required
              />
            </div>
            <div className="col-md-12 mb-2">
              <strong>Phương thức thanh toán:</strong>
              <span className="ms-2 text-danger text-decoration-underline">
                Thanh toán khi nhận hàng
              </span>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="text-end mt-6">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={closeAddPayment}
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleConfirm}
          >
            Tạo phiếu giao dịch
          </button>
        </div>
      </form>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận tạo phiếu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn thông tin trên phiếu giao dịch là chính xác không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleConfirmSubmit}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddPayment;
