import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { BASE_URL } from "../../../Utils/config";

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const token = localStorage.getItem("access_token");
  const statusOptions = [
    "PENDING",
    "CANCELLED",
    "FINDINGTRUCK",
    "ACCEPTED",
    "PACKAGING",
    "DELIVERING",
    "DELIVERED",
    "LOST",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams({
        page: 1,
        size: 10,
        sortBy: "id",
        direction: "ASC",
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
          {data?.content?.map((order) => {
            const totalAmount = order.orderDetails.reduce(
              (sum, item) => sum + item.quantity * item.productSku.sellingPrice,
              0
            );
            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.address.recipientName || "Chưa có tên"}</td>
                <td>{totalAmount.toLocaleString()} VND</td>
                <td>
                  <select
                    className="form-select"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
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
    </div>
  );
};

export default OrderList;
