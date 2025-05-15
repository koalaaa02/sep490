import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../Utils/config";
import { Modal, Button, Alert, Form, Col } from "react-bootstrap"; // Added Alert and Form
import dayjs from "dayjs";

const AddPayment = ({
  orderData,
  closeAddPayment,
  onPaymentCreated,
  totalPaid,
}) => {
  const initialPaymentState = {
    invoiceId: orderData?.invoice?.id || null,
    amountPaid: "", // Initialize as empty for placeholder or 0
    paymentDate: dayjs().format("YYYY-MM-DDTHH:mm:ss"), // Full datetime string
  };

  const [paymentData, setPaymentData] = useState(initialPaymentState);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null); // For general API errors
  const [showConfirm, setShowConfirm] = useState(false);
  const token = sessionStorage.getItem("access_token");

  const amountDue = orderData ? orderData.totalAmount - totalPaid : 0;

  useEffect(() => {
    // Reset form and errors if orderData changes or is invalid
    if (orderData?.invoice?.id) {
      setPaymentData({
        invoiceId: orderData.invoice.id,
        amountPaid: "", // Or prefill: Math.max(0, amountDue) but let user type
        paymentDate: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
      });
      setFormErrors({});
      setApiError(null);
    } else if (orderData) {
      // orderData exists but invoice.id is missing
      setApiError(
        "Thông tin hóa đơn không hợp lệ hoặc không tồn tại cho đơn hàng này."
      );
      setPaymentData((prev) => ({ ...prev, invoiceId: null })); // Ensure invoiceId is null
    }
  }, [orderData, totalPaid]); // Rerun if orderData or totalPaid changes

  const validatePaymentForm = () => {
    const errors = {};
    const amount = parseFloat(paymentData.amountPaid);

    if (!paymentData.invoiceId) {
      errors.general = "Không thể tạo thanh toán: Thiếu ID hóa đơn.";
      // This case should ideally be prevented by disabling form if invoiceId is missing
    }
    if (isNaN(amount) || paymentData.amountPaid.trim() === "") {
      errors.amountPaid = "Vui lòng nhập số tiền thanh toán.";
    } else if (amount <= 0) {
      errors.amountPaid = "Số tiền thanh toán phải là một số dương.";
    } else if (amount > amountDue) {
      errors.amountPaid = `Số tiền thanh toán không được vượt quá số tiền còn lại phải trả (${amountDue.toLocaleString()} VNĐ).`;
    }

    if (!paymentData.paymentDate || !dayjs(paymentData.paymentDate).isValid()) {
      errors.paymentDate = "Ngày thanh toán không hợp lệ.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
    // Clear specific field error on change
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
    // Clear general API error on any input change
    if (apiError) setApiError(null);
  };

  const handlePaymentDateChange = (e) => {
    const newDatePart = e.target.value; // YYYY-MM-DD
    // Preserve existing time, or set to current time if not present
    const existingTimePart = paymentData.paymentDate
      ? dayjs(paymentData.paymentDate).format("THH:mm:ss")
      : dayjs().format("THH:mm:ss");

    setPaymentData({
      ...paymentData,
      paymentDate: `${newDatePart}${existingTimePart}`,
    });
    if (formErrors.paymentDate) {
      setFormErrors({ ...formErrors, paymentDate: null });
    }
    if (apiError) setApiError(null);
  };

  const handleConfirm = () => {
    setApiError(null); // Clear previous API errors before new validation
    if (validatePaymentForm()) {
      setShowConfirm(true);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!validatePaymentForm()) {
      // Final check, though ideally validated before showing modal
      setShowConfirm(false); // Close confirm modal if validation fails
      return;
    }
    try {
      const body = {
        ...paymentData,
        amountPaid: parseFloat(paymentData.amountPaid), // Ensure amountPaid is a number
      };
      const response = await fetch(`${BASE_URL}/api/provider/debt-payments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorMsg = "Có lỗi khi tạo phiếu thanh toán.";
        try {
          const errorData = await response.json();
          if (errorData && (errorData.message || errorData.error)) {
            errorMsg = errorData.message || errorData.error;
          } else if (typeof errorData === "string" && errorData.length > 0) {
            errorMsg = errorData;
          }
          // Handle field-specific errors from backend if available
          // if (errorData.errors) { setFormErrors(prev => ({...prev, ...errorData.errors})); }
        } catch (e) {
          errorMsg = `Lỗi ${response.status}: ${
            response.statusText || "Không thể kết nối máy chủ"
          }`;
        }
        throw new Error(errorMsg);
      }

      // const createdPayment = await response.json(); // If you need the created payment details

      if (typeof onPaymentCreated === "function") {
        await onPaymentCreated(); // Callback to parent
      }
      setShowConfirm(false);
      alert("Tạo phiếu thanh toán thành công!");
      closeAddPayment(); // Close the payment form/modal
    } catch (error) {
      setApiError(error.message || "Đã xảy ra lỗi không xác định.");
      setShowConfirm(false); // Ensure confirm modal is closed on error
    }
  };

  // Early return or disable form if critical data is missing
  if (!orderData) {
    return (
      <div className="p-3">
        <Alert variant="warning">
          Không có dữ liệu đơn hàng để tạo thanh toán.
        </Alert>
        <Button variant="secondary" onClick={closeAddPayment}>
          Đóng
        </Button>
      </div>
    );
  }
  if (!orderData.invoice?.id) {
    return (
      <div className="p-3">
        <Alert variant="danger">
          Thiếu thông tin hóa đơn cho đơn hàng {orderData.orderCode}. Không thể
          tạo thanh toán.
        </Alert>
        <Button variant="secondary" onClick={closeAddPayment}>
          Đóng
        </Button>
      </div>
    );
  }

  return (
    <div
      className="p-3 mb-10"
      style={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}
    >
      <h4>Thêm phiếu thanh toán</h4>
      <Form noValidate>
        {" "}
        {/* Added noValidate to disable browser default validation bubbles */}
        <div className="border p-3 mb-3">
          <h5>Thông tin hóa đơn</h5>
          <div className="row">
            <div className="col-md-6 mb-2">
              <strong className="me-2">Mã hóa đơn:</strong>
              <span>{orderData.orderCode}</span>
            </div>
            <div className="col-md-6 mb-2">
              <strong className="me-2">Tổng tiền hóa đơn:</strong>
              <span>{orderData.totalAmount?.toLocaleString()} VNĐ</span>
            </div>
            <div className="col-md-6 mb-2">
              <strong className="me-2">Đã thanh toán:</strong>
              <span>{totalPaid?.toLocaleString()} VNĐ</span>
            </div>
            <div className="col-md-6 mb-2">
              <strong className="me-2">Còn lại phải trả:</strong>
              <span className="fw-bold text-danger">
                {amountDue?.toLocaleString()} VNĐ
              </span>
            </div>
          </div>
        </div>
        <div className="border p-3 mb-3">
          <h5>Thông tin thanh toán</h5>
          <Form.Group className="row mb-3" controlId="paymentCustomerName">
            <Form.Label column sm={4} className="fw-bold">
              Người trả tiền:
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                value={orderData.address?.recipientName || "N/A"}
                readOnly
                plaintext
              />
            </Col>
          </Form.Group>

          <Form.Group className="row mb-3" controlId="paymentCustomerPhone">
            <Form.Label column sm={4} className="fw-bold">
              SĐT người trả:
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                value={orderData.address?.phone || "N/A"}
                readOnly
                plaintext
              />
            </Col>
          </Form.Group>

          <Form.Group className="row mb-3" controlId="paymentDateInput">
            <Form.Label column sm={4} className="fw-bold">
              Ngày giao dịch:
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="date"
                name="paymentDate"
                value={dayjs(paymentData.paymentDate).format("YYYY-MM-DD")}
                onChange={handlePaymentDateChange}
                isInvalid={!!formErrors.paymentDate}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.paymentDate}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group className="row mb-3" controlId="amountPaidInput">
            <Form.Label column sm={4} className="fw-bold">
              Nhập số tiền trả:
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="number"
                name="amountPaid"
                placeholder="Nhập số tiền"
                value={paymentData.amountPaid}
                onChange={handleInputChange}
                isInvalid={!!formErrors.amountPaid}
                min="0"
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.amountPaid}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <div className="col-md-12 mb-2">
            <strong>Phương thức thanh toán:</strong>
            <span className="ms-2">Thanh toán khi nhận hàng (COD)</span>
          </div>
        </div>
        {apiError && (
          <Alert variant="danger" className="mt-3">
            {apiError}
          </Alert>
        )}
        {formErrors.general && (
          <Alert variant="danger" className="mt-3">
            {formErrors.general}
          </Alert>
        )}
        <div className="text-end mt-4">
          <Button
            variant="secondary"
            className="me-2"
            onClick={closeAddPayment}
          >
            Hủy bỏ
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!paymentData.invoiceId} // Disable if no invoiceId
          >
            Tạo phiếu thanh toán
          </Button>
        </div>
      </Form>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận tạo phiếu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Bạn có chắc chắn muốn tạo phiếu thanh toán với số tiền là{" "}
            <strong>
              {parseFloat(paymentData.amountPaid || 0).toLocaleString()} VNĐ
            </strong>
            ?
          </p>
          <p>
            Ngày giao dịch:{" "}
            {dayjs(paymentData.paymentDate).format("DD/MM/YYYY HH:mm")}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowConfirm(false)}
          >
            Xem lại
          </Button>
          <Button variant="primary" onClick={handleConfirmSubmit}>
            Xác nhận và Tạo
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddPayment;
