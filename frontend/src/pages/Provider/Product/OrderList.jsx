import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { BASE_URL } from "../../../Utils/config";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const token = localStorage.getItem("access_token");
  const [page, setPage] = useState(1);
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
  }, [page]);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams({
        page: page,
        size: 15, // Số lượng đơn hàng trên một trang
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
    setExpandedOrderId(order.id === expandedOrderId ? null : order.id);
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
    CANCELLED: "Đã hủy",
    FINDINGTRUCK: "Đang tìm xe",
    ACCEPTED: "Đã chấp nhận",
    PACKAGING: "Đóng gói",
    DELIVERING: "Đang giao",
    DELIVERED: "Đã giao",
  };

  return (
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
            <th>Phương thức vận chuyển</th>
            <th>Phương thức thanh toán</th>
            <th>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders?.map((order, index) => {
            return (
              <React.Fragment key={order.id}>
                <tr>
                  <td>{index + 1}</td>
                  <td
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => handleOrderClick(order)}
                  >
                    {`VN${
                      order.deliveryMethod === "GHN" ? "GHN" : "DEB"
                    }${Math.floor(
                      new Date(order.createdAt).getTime() / 1000
                    )}${order.address.recipientName
                      ?.slice(0, 2)
                      .toUpperCase()}`}
                  </td>
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
                    {order.deliveryMethod === "GHN"
                      ? "Giao hàng nhanh"
                      : "Liên hệ với người bán"}
                  </td>
                  <td>
                    {order.paymentMethod === "COD"
                      ? "Thanh toán khi nhận hàng"
                      : "Trả góp"}
                  </td>
                  <td>
                    <span>
                      {statusTranslations[order.status] || order.status}
                    </span>
                  </td>
                </tr>

                {expandedOrderId === order.id && (
                  <tr>
                    <td colSpan="10">
                      <div>
                        <strong>Thông tin chi tiết đơn hàng:</strong>
                        <table className="table table-bordered table-striped mt-3">
                          <thead>
                            <tr>
                              <th>Ảnh sản phẩm</th>
                              <th>Sản phẩm</th>
                              <th>Số lượng</th>
                              {/* <th>Số lượng trong kho</th> */}
                              <th>Giá</th>
                              <th>Tổng tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.orderDetails.map((detail, idx) => (
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
                                {/* <td>{detail.productSku.stock}</td> */}
                                <td>
                                  {detail.productSku.sellingPrice.toLocaleString()}{" "}
                                  VND
                                </td>
                                <td>
                                  {(
                                    detail.quantity *
                                    detail.productSku.sellingPrice
                                  ).toLocaleString()}{" "}
                                  VND
                                </td>
                              </tr>
                            ))}
                            <strong className="ms-2">
                              Thay đổi trạng thái:{" "}
                            </strong>
                            <select
                              className="form-select m-2"
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value)
                              }
                            >
                              {(() => {
                                let filteredOptions = [];

                                if (
                                  order.status === "PENDING" ||
                                  order.status === "FINDINGTRUCK"
                                ) {
                                  filteredOptions = [
                                    "PENDING",
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
                                    {statusTranslations[status] || status}
                                  </option>
                                ));
                              })()}
                            </select>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
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
                className={`page-item ${page === totalPages ? "disabled" : ""}`}
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

      {/* Modal xác nhận thay đổi trạng thái */}
      <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận thay đổi trạng thái</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc muốn đổi trạng thái đơn hàng không?</p>
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
    </div>
  );
};

export default OrderList;
