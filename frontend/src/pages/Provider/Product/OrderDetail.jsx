import React, { useState } from "react";
import { BASE_URL } from "../../../Utils/config";
import { Modal, Button, Form, Card } from "react-bootstrap";
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
        <div className="p-3 mb-10" style={{ height: "100%" }}>
          <div className="d-flex align-items-center mb-2">
            <button className="btn btn-secondary me-2" onClick={onBack}>
              Quay lại
            </button>
            <h4>Chi tiết đơn hàng:</h4>
          </div>
          <div className="mt-2">
            <Card>
              <Card.Header>Thông tin nhà cung cấp</Card.Header>
              <Card.Body>
                <div className="row">
                  <div className="row">
                    <div className="col-12 d-flex align-items-center mb-2">
                      <strong className="me-2">Tên nhà cung cấp:</strong>
                      <span className="text-muted">{data.shop.name}</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 d-flex align-items-center mb-2">
                      <strong className="me-2">Mã số thuế:</strong>
                      <span className="text-muted">{data.shop.tin}</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="mt-2">
              <Card.Header>Danh sách sản phẩm</Card.Header>
              <Card.Body>
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
              </Card.Body>
            </Card>
          </div>
          <Card className="mt-4">
            <Card.Header>Thông tin đơn hàng</Card.Header>
            <Card.Body>
              <div className="row">
                {/* Cột trái */}
                <div className="col-md-4 mb-2">
                  <div className="mb-2 d-flex align-items-center">
                    <strong className="me-2">Mã đơn hàng:</strong>
                    <span className="text-muted">{data.orderCode}</span>
                  </div>
                  <div className="mb-2 d-flex align-items-center">
                    <strong className="me-2">Ngày tạo:</strong>
                    <span className="text-muted">
                      {new Date(data.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>

                {/* Cột giữa */}
                <div className="col-md-4 mb-2">
                  <div className="mb-2 d-flex align-items-center">
                    <strong className="me-2">Người nhận:</strong>
                    <span className="text-muted">
                      {data.address?.recipientName}
                    </span>
                  </div>
                  <div className="mb-2 d-flex align-items-center">
                    <strong className="me-2">Số điện thoại:</strong>
                    <span className="text-muted">{data.address?.phone}</span>
                  </div>
                </div>

                {/* Cột phải */}
                <div className="col-md-4 mb-2">
                  <div className="mb-2 d-flex align-items-center">
                    <strong className="me-2">Ngày giao:</strong>
                    <span className="text-muted">
                      {data?.deliveryNotes &&
                      data.deliveryNotes.length > 0 &&
                      data.deliveryNotes[0].deliveredDate
                        ? new Date(
                            data.deliveryNotes[0].deliveredDate
                          ).toLocaleDateString("vi-VN")
                        : ""}
                    </span>
                  </div>
                  <div className="mb-2 d-flex align-items-center">
                    <strong className="me-2">Phí giao hàng:</strong>
                    <span className="text-muted">
                      {`${data.shippingFee.toLocaleString()} VND`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Địa chỉ giao */}
              <div className="row">
                <div className="col-12 d-flex align-items-center mb-2">
                  <strong className="me-2">Địa chỉ giao:</strong>
                  <span className="text-muted">
                    {`${data.address?.address}, ${data.address?.ward}, ${data.address?.province}`}
                  </span>
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="row">
                <div className="col-md-12 d-flex align-items-center mb-2">
                  <strong className="me-2">Tổng tiền:</strong>
                  <span className="text-muted">
                    {`${data.totalAmount.toLocaleString()} VND`}
                  </span>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="row">
                <div className="col-12 d-flex align-items-center mb-2">
                  <strong className="me-2">Phương thức:</strong>
                  <span className="text-muted">
                    {data.paymentMethod === "COD"
                      ? "Thanh toán khi nhận hàng"
                      : "Trả góp"}
                  </span>
                </div>
              </div>

              {/* Trạng thái và nút hành động */}
              {!fromDeliveryList && data.status !== "DELIVERED" && (
                <div className="row">
                  <div className="col-12 d-flex align-items-center mb-2">
                    <strong>Thay đổi trạng thái:</strong>
                    <div className="d-flex flex-wrap m-2">
                      {(() => {
                        let filteredOptions = [];

                        if (
                          data.status === "PENDING" ||
                          data.status === "FINDINGTRUCK"
                        ) {
                          filteredOptions = ["ACCEPTED", "CANCELLED"];
                        } else if (data.status === "ACCEPTED") {
                          filteredOptions = ["DELIVERING", "DELIVERED"];
                        } else if (data.status === "DELIVERING") {
                          filteredOptions = ["DELIVERED"];
                        } else {
                          filteredOptions = statusOptions;
                        }

                        return filteredOptions.map((status) => (
                          <button
                            key={status}
                            className={`btn m-1 ${
                              status === data.status
                                ? "btn-secondary"
                                : status === "CANCELLED" ||
                                  status === "DELIVERED"
                                ? "btn-danger"
                                : "btn-success"
                            }`}
                            disabled={status === data.status}
                            onClick={() => handleStatusChange(data.id, status)}
                          >
                            {statusTranslations[status]}
                          </button>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              )}
              {!fromDeliveryList && data.status === "DELIVERING" && (
                <button className="btn btn-primary" onClick={toggleInvoiceForm}>
                  In phiếu giao hàng
                </button>
              )}
            </Card.Body>
          </Card>

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
