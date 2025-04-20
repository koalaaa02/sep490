import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { BASE_URL } from "../../../Utils/config";
import { Link } from "react-router-dom";
import OrderDetails from "./OrderDetail";
import { Badge } from "react-bootstrap";

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(null);
  const [currentView, setCurrentView] = useState("list");
  const token = localStorage.getItem("access_token");
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("");
  const [filterDirection, setFilterDirection] = useState("DESC");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [size, setSize] = useState(10);
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
  }, [page, filterStatus, filterPaymentMethod, filterDirection, size]);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams({
        page: page,
        size: size,
        sortBy: "id",
        status: filterStatus,
        paymentMethod: filterPaymentMethod,
        direction: filterDirection,
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

  const handleStatusClick = (status) => {
    if (status === " ") {
      setFilterStatus(" ");
    }
    setFilterStatus(status === filterStatus ? null : status);
  };

  const filteredOrders = data?.content?.filter((order) =>
    order.address.recipientName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = data?.totalElements
    ? Math.ceil(data?.totalElements / 15)
    : 0;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const statusTranslations = {
    PENDING: "Đang chờ",
    CANCELLED: "Hủy",
    FINDINGTRUCK: "Đang tìm xe",
    ACCEPTED: "Chấp nhận",
    PACKAGING: "Đóng gói",
    DELIVERING: "Chưa giao",
    DELIVERED: "Đã giao",
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setCurrentView("details");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedOrder(null);
  };

  const statusColors = {
    PENDING: "secondary",
    CANCELLED: "danger",
    FINDINGTRUCK: "info",
    ACCEPTED: "primary",
    PACKAGING: "dark",
    DELIVERING: "warning",
    DELIVERED: "success",
  };

  return (
    <>
      {currentView === "list" ? (
        <div className="p-3 mb-10">
          <h3>Danh sách đặt hàng</h3>
          <div className="mb-3 d-flex align-items-center">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm tên khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-dark">
              <FaSearch />
            </button>
          </div>
          <div className="mb-3 d-flex">
            {/* Status Dropdown */}
            <div className="me-3">
              <label>Trạng thái:</label>

              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => handleStatusClick(e.target.value)}
              >
                <option value="">Tất cả</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {statusTranslations[status] || status}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Dropdown */}
            <div className="me-3">
              <label>Phương thức thanh toán: </label>
              <select
                className="form-select"
                value={filterPaymentMethod}
                onChange={(e) => setFilterPaymentMethod(e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="COD">Thanh toán khi nhận hàng</option>
                <option value="DEBT">Trả góp</option>
              </select>
            </div>

            <div className="me-3">
              <label>Sắp xếp theo: </label>
              <select
                className="form-select"
                value={filterDirection}
                onChange={(e) => setFilterDirection(e.target.value)}
              >
                <option value="DESC">Mới nhất</option>
                <option value="ASC">Cũ nhất</option>
              </select>
            </div>

            <div>
              <label>Số sản phẩm: </label>
              <select
                className="form-select"
                value={filterDirection}
                onChange={(e) => setSize(e.target.value)}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>

          <div className="border p-2 mb-3">
            <strong>Thống kê nhanh:</strong>
            <div>Tổng hóa đơn: {data?.totalElements || 0}</div>
          </div>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã đơn</th>
                <th>Ngày tạo</th>
                <th>Khách hàng</th>
                <th>Địa chỉ nhận hàng</th>
                <th>Số điện thoại người nhận</th>
                {/* <th>Phương thức vận chuyển</th> */}
                <th>Phương thức thanh toán</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders?.map((order, index) => {
                return (
                  <React.Fragment key={order.id}>
                    <tr
                      onClick={() => handleOrderClick(order)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{index + 1}</td>
                      <td>{order.orderCode}</td>
                      <td>
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td>{order.address.recipientName || "Chưa có tên"}</td>
                      <td>
                        {order.address.address}, {order.address.ward},{" "}
                        {order.address.province}
                      </td>
                      <td>{order.address.phone}</td>
                      <td>
                        {order.paymentMethod === "COD"
                          ? "Thanh toán khi nhận hàng"
                          : "Trả góp"}
                      </td>
                      <td>
                        <Badge bg={statusColors[order.status] || "secondary"}>
                          {statusTranslations[order.status] || order.status}
                        </Badge>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          <div className="row mt-8">
            <div className="col">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <Link
                      className="page-link mx-1 rounded-3"
                      to="#"
                      onClick={() => handlePageChange(page - 1)}
                      aria-label="Previous"
                    >
                      <i className="fa fa-chevron-left" />
                    </Link>
                  </li>

                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <li
                        key={pageNumber}
                        className={`page-item ${
                          page === pageNumber ? "active" : ""
                        }`}
                      >
                        <Link
                          className="page-link mx-1 rounded-3 text-body"
                          to="#"
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </Link>
                      </li>
                    );
                  })}

                  <li
                    className={`page-item ${
                      page === totalPages ? "disabled" : ""
                    }`}
                  >
                    <Link
                      className="page-link mx-1 rounded-3"
                      to="#"
                      onClick={() => handlePageChange(page + 1)}
                      aria-label="Next"
                    >
                      <i className="fa fa-chevron-right" />
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      ) : (
        <OrderDetails
          order={selectedOrder}
          onBack={handleBackToList}
          fromDeliveryList={false}
        />
      )}
    </>
  );
};

export default OrderList;
