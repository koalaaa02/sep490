import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { BASE_URL } from "../../../Utils/config";
import { Modal, Button } from "react-bootstrap";

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const token = localStorage.getItem("access_token");
  const statusOptions = [
    "PENDING",
    "CANCELLED",
    "FINDINGTRUCK",
    "ACCEPTED",
    "PACKAGING",
    "DELIVERING",
    "DELIVERED",
    // "LOST",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams({
        page: 1,
        size: 50,
        sortBy: "id",
        direction: "DESC",
      });

      const response = await fetch(
        `${BASE_URL}/api/provider/orders/?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedOrder(orderId);
    setSelectedStatus(newStatus);
    setShowPopup(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedOrder || !selectedStatus) return;

    try {
      const response = await fetch(`${BASE_URL}/api/provider/orders/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: [selectedOrder],
          status: selectedStatus,
        }),
      });

      if (response.ok) {
        setData((prevData) => ({
          ...prevData,
          content: prevData.content.map((order) =>
            order.id === selectedOrder
              ? { ...order, status: selectedStatus }
              : order
          ),
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
      setSelectedOrder(null);
      setSelectedStatus("");
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const filteredOrders = data?.content?.filter((order) =>
    order.address.recipientName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3 mb-10">
      <h3>Danh sách đặt hàng</h3>
      <div className="mb-3 d-flex align-items-center">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-dark">
          <FaSearch />
        </button>
      </div>
      <div className="border p-2 mb-3">
        <strong>Thống kê nhanh:</strong>
        <div>Tổng hóa đơn: {data?.content?.length || 0}</div>
        <div>Tổng tiền: ...</div>
      </div>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Ngày tạo</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders?.map((order) => {
            const totalAmount = order.orderDetails.reduce(
              (sum, item) => sum + item.quantity * item.productSku.sellingPrice,
              0
            );
            return (
              <tr key={order.id}>
                <td
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => handleOrderClick(order)}
                >
                  {order.id}
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                <td>{order.address.recipientName || "Chưa có tên"}</td>
                <td>{totalAmount.toLocaleString()} VND</td>
                <td>
                  <select
                    className="form-select"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    disabled={order.status === "CANCELLED"}
                  >
                    {(() => {
                      let filteredOptions = [];

                      if (
                        order.status === "PENDING" ||
                        order.status === "FINDINGTRUCK"
                      ) {
                        filteredOptions = [
                          order.status,
                          "ACCEPTED",
                          "CANCELLED",
                        ];
                      } else if (order.status === "ACCEPTED") {
                        filteredOptions = [
                          "PACKAGING",
                          "DELIVERING",
                          "DELIVERED",
                        ];
                      } else if (
                        order.status === "PACKAGING" ||
                        order.status === "DELIVERING" ||
                        order.status === "DELIVERED"
                      ) {
                        filteredOptions = [
                          "PACKAGING",
                          "DELIVERING",
                          "DELIVERED",
                        ];
                      } else {
                        filteredOptions = statusOptions;
                      }

                      return filteredOptions.map((status) => (
                        <option
                          key={status}
                          value={status}
                          disabled={status === order.status}
                        >
                          {status}
                        </option>
                      ));
                    })()}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Bạn có chắc muốn đổi trạng thái đơn hàng không?</p>
            <button className="btn btn-success" onClick={confirmStatusChange}>
              Xác nhận
            </button>
            <button
              className="btn btn-danger"
              onClick={() => setShowPopup(false)}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      <Modal
        show={showOrderDetails}
        onHide={() => setShowOrderDetails(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder?.orderDetails?.length > 0 ? (
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>SKU Code</th>
                  <th>Hình ảnh</th>
                  <th>Số lượng</th>
                  <th>Giá bán</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.orderDetails.map((detail, index) => (
                  <tr key={index}>
                    <td>{detail.productSku.skuCode}</td>
                    <td>
                      <img
                        src={detail.productSku.images}
                        alt={detail.productSku.skuCode}
                        style={{ width: "80px" }}
                      />
                    </td>
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
          ) : (
            <p>Không có chi tiết đơn hàng nào.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowOrderDetails(false)}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderList;
