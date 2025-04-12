import React, { useState } from "react";
import { BASE_URL } from "../../../Utils/config";
import { Modal, Button, Form } from "react-bootstrap";
import AddInvoice from "../Invoice/AddInvoice";

const OrderDetails = ({ order, onBack, fromDeliveryList }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(order?.id || null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [data, setData] = useState(order);
  const token = localStorage.getItem("access_token");

  const statusOptions = [
    "PENDING",
    "CANCELLED",
    "FINDINGTRUCK",
    "ACCEPTED",
    "PACKAGING",
    "DELIVERING",
    "DELIVERED",
  ];

  const statusTranslations = {
    PENDING: "Đang chờ",
    CANCELLED: "Hủy",
    FINDINGTRUCK: "Đang tìm xe",
    ACCEPTED: "Chấp nhận",
    PACKAGING: "Đóng gói",
    DELIVERING: "Chưa giao",
    DELIVERED: "Đã giao",
  };

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedOrder(orderId);
    setSelectedStatus(newStatus);

    if (newStatus === "DELIVERING") {
      setShowConfirm(true);
    } else if (newStatus === "DELIVERED") {
      if (data.paymentMethod === "COD") {
        setShowPaymentPopup(true);
      } else {
        setShowPopup(true);
      }
    } else {
      setShowPopup(true);
    }
  };

  const confirmStatusChange = async () => {
    if (!selectedOrder || !selectedStatus) return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/provider/orders/change-status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: [selectedOrder],
            status: selectedStatus,
          }),
        }
      );

      if (response.ok) {
        setData((prev) => ({
          ...prev,
          status: selectedStatus,
        }));
        alert("Cập nhật trạng thái thành công!");
      } else {
        alert("Cập nhật thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Có lỗi xảy ra!");
    } finally {
      setShowPopup(false);
      setShowPaymentPopup(false);
      setShowConfirm(false);
      setSelectedOrder(null);
      setSelectedStatus("");
    }
  };

  const confirmPaymentAndCreateInvoice = async () => {
    if (!paymentAmount || paymentAmount <= 0) {
      alert("Số tiền thanh toán phải lớn hơn 0.");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/provider/orders/change-status-and_create-invoice`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedOrder,
            amount: paymentAmount,
            status: "DELIVERED",
          }),
        }
      );

      if (response.ok) {
        setData((prev) => ({
          ...prev,
          status: "DELIVERED",
        }));
        alert("Đơn nợ đã được tạo thành công!");
        setShowPaymentPopup(false);
      } else {
        alert("Có lỗi khi tạo đơn nợ. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn nợ:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const toggleInvoiceForm = () => setShowInvoiceForm(true);
  const closeAddInvoice = () => setShowInvoiceForm(false);

  return (
    <>
      {showInvoiceForm ? (
        <AddInvoice closeAddInvoice={closeAddInvoice} orderData={data} />
      ) : (
        <div className="p-3">
          <div className="d-flex align-items-center mb-2">
            <button className="btn btn-secondary me-2" onClick={onBack}>
              Quay lại
            </button>
            <h4>Chi tiết đơn hàng:</h4>
          </div>
          <div></div>
          <div className="mt-4">
            <h5>Thông tin đơn hàng</h5>
            <div className="row">
              {/* Cột trái */}
              <div className="col-md-3 pe-1">
                <Form.Group className="mb-3">
                  <Form.Label>Mã đơn hàng</Form.Label>
                  <Form.Control value={data.orderCode} readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Ngày tạo</Form.Label>
                  <Form.Control
                    value={new Date(data.createdAt).toLocaleString("vi-VN")}
                    readOnly
                  />
                </Form.Group>
              </div>

              {/* Cột giữa */}
              <div className="col-md-6 px-1">
                <Form.Group className="mb-3">
                  <Form.Label>Người nhận</Form.Label>
                  <Form.Control value={data.address?.recipientName} readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control value={data.address?.phone} readOnly />
                </Form.Group>
              </div>

              {/* Cột phải */}
              <div className="col-md-3 ps-1">
                <Form.Group className="mb-3">
                  <Form.Label>Ngày giao</Form.Label>
                  <Form.Control
                    value={
                      data?.deliveryNotes && data.deliveryNotes.length > 0
                        ? new Date(
                            data.deliveryNotes[0].deliveredDate
                          ).toLocaleDateString("vi-VN")
                        : ""
                    }
                    readOnly
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phí giao hàng</Form.Label>
                  <Form.Control
                    value={`${data.shippingFee.toLocaleString()} VND`}
                    readOnly
                  />
                </Form.Group>
              </div>
            </div>

            {/* Địa chỉ giao (full row) */}
            <div className="row">
              <div className="col-12">
                <Form.Group className="mb-3">
                  <Form.Label>Địa chỉ giao</Form.Label>
                  <Form.Control
                    value={`${data.address?.address}, ${data.address?.ward}, ${data.address?.province}`}
                    readOnly
                  />
                </Form.Group>
              </div>
            </div>

            {/* Hoa hồng & Tổng tiền */}
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Mã giao dịch</Form.Label>
                  <Form.Control value={data.deliveryCode} readOnly />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Tổng tiền</Form.Label>
                  <Form.Control
                    value={`${data.totalAmount.toLocaleString()} VND`}
                    readOnly
                  />
                </Form.Group>
              </div>
            </div>

            {/* Phương thức (full row cuối) */}
            <div className="row">
              <div className="col-12">
                <Form.Group className="mb-3">
                  <Form.Label>Phương thức</Form.Label>
                  <Form.Control
                    value={
                      data.paymentMethod === "COD"
                        ? "Thanh toán khi nhận hàng"
                        : "Trả góp"
                    }
                    readOnly
                  />
                </Form.Group>
              </div>
            </div>
          </div>
          <div className="mb-10">
            <h5>Chi tiết đơn hàng</h5>
            <div className="d-flex flex-column">
              <div>
                <strong>Tên cửa hàng: </strong>
                <span>{data.shop.name}</span>
              </div>
              <div>
                <strong>Mã số thuế: </strong>
                <span>{data.shop.tin}</span>
              </div>
              <div>
                <strong>Danh sách sản phẩm: </strong>
              </div>
            </div>

            <table className="table table-bordered table-striped mt-3">
              <thead>
                <tr>
                  <th>Ảnh sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Giá</th>
                  <th>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {data.orderDetails.map((detail, idx) => (
                  <tr key={idx}>
                    <td>
                      <img
                        src={detail.productSku.images}
                        alt=""
                        style={{ height: "50px", width: "50px" }}
                      />
                    </td>
                    <td>{detail.productSku.skuCode}</td>
                    <td>{detail.quantity}</td>
                    <td>
                      {detail.productSku.sellingPrice.toLocaleString()} VND
                    </td>
                    <td>
                      {(
                        detail.quantity * detail.productSku.sellingPrice
                      ).toLocaleString()}{" "}
                      VND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!fromDeliveryList && (
              <div className="col-2">
                <strong>Thay đổi trạng thái:</strong>
                <select
                  className="form-select m-2"
                  value={data.status}
                  onChange={(e) => handleStatusChange(data.id, e.target.value)}
                >
                  {(() => {
                    let filteredOptions = [];

                    if (
                      data.status === "PENDING" ||
                      data.status === "FINDINGTRUCK"
                    ) {
                      filteredOptions = ["PENDING", "ACCEPTED", "CANCELLED"];
                    } else if (data.status === "ACCEPTED") {
                      filteredOptions = ["ACCEPTED", "DELIVERING", "DELIVERED"];
                    } else if (data.status === "DELIVERING") {
                      filteredOptions = ["DELIVERING", "DELIVERED"];
                    } else {
                      filteredOptions = statusOptions;
                    }

                    return filteredOptions.map((status) => (
                      <option
                        key={status}
                        value={status}
                        disabled={status === data.status}
                      >
                        {statusTranslations[status]}
                      </option>
                    ));
                  })()}
                </select>
              </div>
            )}

            {!fromDeliveryList && data.status === "DELIVERING" && (
              <button
                className="btn btn-primary mt-4 ms-2"
                onClick={toggleInvoiceForm}
              >
                In phiếu giao hàng
              </button>
            )}
          </div>
          {/* Popup xác nhận */}
          <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Xác nhận thay đổi trạng thái</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Bạn có chắc muốn đổi trạng thái đơn hàng không?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={confirmStatusChange}>
                Xác nhận
              </Button>
              <Button variant="danger" onClick={() => setShowPopup(false)}>
                Hủy
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal cảnh báo trước khi giao hàng */}
          <Modal
            show={showConfirm}
            onHide={() => setShowConfirm(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Chú ý</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Bạn cần in phiếu giao hàng trước khi chuyển sang trạng thái "Đã
              giao".
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={confirmStatusChange}>
                Xác nhận
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setShowConfirm(false);
                  setShowPopup(false);
                }}
              >
                Hủy
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal thanh toán */}
          <Modal
            show={showPaymentPopup}
            onHide={() => setShowPaymentPopup(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Xác nhận thanh toán</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Số tiền đơn hàng</Form.Label>
                <Form.Control
                  type="number"
                  value={data.totalAmount || 0}
                  readOnly
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Số tiền người mua đã thanh toán</Form.Label>
                <Form.Control
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowPaymentPopup(false)}
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (paymentAmount > data.totalAmount) {
                    alert(
                      "Số tiền thanh toán không được vượt quá tổng tiền đơn hàng."
                    );
                    return;
                  }

                  if (paymentAmount < data.totalAmount) {
                    confirmPaymentAndCreateInvoice();
                  } else {
                    confirmStatusChange();
                  }
                }}
              >
                Xác nhận
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default OrderDetails;
