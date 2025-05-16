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
  const token = sessionStorage.getItem("access_token");
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("");
  const [filterDirection, setFilterDirection] = useState("DESC");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [size, setSize] = useState(10);
  const [paid, setPaid] = useState(false);
  const statusOptions = [
    "PENDING",
    "CANCELLED",
    "ACCEPTED",
    "DELIVERING",
    "DELIVERED",
  ];

  useEffect(() => {
    fetchData();
  }, [page, filterStatus, filterPaymentMethod, filterDirection, size, paid]);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams({
        page: page,
        size: size,
        sortBy: "id",
        status: filterStatus,
        paymentMethod: filterPaymentMethod,
        direction: filterDirection,
        paid: paid, // Thêm bộ lọc paid vào URL params
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

  const filteredOrders = data?.content?.filter(
    (order) =>
      order.address.recipientName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase())
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
    ACCEPTED: "Chấp nhận",
    DELIVERING: "Chưa giao",
    DELIVERED: "Đã giao",
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setCurrentView("details");
  };

  const handleBackToList = () => {
    fetchData();
    setCurrentView("list");
    setSelectedOrder(null);
  };

  const statusColors = {
    PENDING: "secondary",
    CANCELLED: "danger",
    ACCEPTED: "primary",
    DELIVERING: "warning",
    DELIVERED: "success",
  };

  const handleSetPaidFilter = (paidStatus) => {
    setPaid(paidStatus);
  };

  const getOrderStatus = (order) => {
    if (order.paid === true) {
      return "DELIVERED";
    }
    return order.status;
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
              placeholder="Tìm kiếm tên khách hàng hoặc mã giao hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-dark">
              <FaSearch />
            </button>
          </div>

          <div class="row mb-3">
            <div class="col-2">
              <div class="d-flex align-items-center">
                <label for="status">Trạng thái:</label>
                <select id="status" className="form-select w-auto">
                  <option value="">Tất cả</option>
                  <option value="pending">Đang chờ</option>
                  <option value="accepted">Chấp nhận</option>
                  <option value="delivered">Đã giao</option>
                </select>
              </div>
            </div>

            <div class="col-2">
              <div class="d-flex align-items-center">
                <label for="sort">Sắp xếp theo:</label>
                <select id="sort" className="form-select w-auto">
                  <option value="desc">Mới nhất</option>
                  <option value="asc">Cũ nhất</option>
                </select>
              </div>
            </div>

            <div class="col-2">
              <div class="d-flex align-items-center">
                <label for="size">Số sản phẩm:</label>
                <select id="size" className="form-select w-auto">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter buttons for paid status */}
          <div className="mb-3">
            {" "}
            <button
              className={`btn ${
                paid === true ? "btn-outline-danger" : "btn-danger"
              } me-2`}
              onClick={() => handleSetPaidFilter(false)}
            >
              Chưa thanh toán
            </button>
            <button
              className={`btn ${
                paid === false ? "btn-outline-success" : "btn-success"
              } me-2`}
              onClick={() => handleSetPaidFilter(true)}
            >
              Đã thanh toán
            </button>
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
                <th>Phương thức thanh toán</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders?.map((order, index) => (
                <tr key={order.id} onClick={() => handleOrderClick(order)}>
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
                      ? "Thanh toán khi đã nhận hàng"
                      : "Thanh toán khi đã nhận hàng"}
                  </td>
                  <td>
                    <Badge
                      bg={statusColors[getOrderStatus(order)] || "secondary"}
                    >
                      {statusTranslations[getOrderStatus(order)] ||
                        order.status}
                    </Badge>
                  </td>
                </tr>
              ))}
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
          paid={paid}
        />
      )}
    </>
  );
};

export default OrderList;
