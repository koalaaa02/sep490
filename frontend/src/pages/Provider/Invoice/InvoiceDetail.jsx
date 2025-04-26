import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../Utils/config";
import { Link } from "react-router-dom";
import OrderDetails from "./../Product/OrderDetail";

const InvoiceDetails = ({ invoice, onClose }) => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("access_token");
  const [page, setPage] = useState(1);
  const [historyVisible, setHistoryVisible] = useState(null);
  const [currentView, setCurrentView] = useState("list");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [pageSize, setPageSize] = useState(10);

  // Hàm tạo tham số cho URL với các giá trị động
  const getQueryParams = () => {
    const params = new URLSearchParams({
      page: page,
      size: pageSize,
      sortBy: "createdAt", // Hoặc bạn có thể dùng trường khác để sắp xếp
      direction: sortOrder, // Thêm direction để sắp xếp theo ASC/DESC
      searchTerm: searchTerm, // Thêm searchTerm để tìm kiếm theo mã khoản nợ
    });

    return params;
  };

  useEffect(() => {
    getUser();
  }, [page, pageSize, sortOrder, searchTerm]); // Lắng nghe thay đổi của page, pageSize, sortOrder, searchTerm

  const getUser = async () => {
    try {
      const params = getQueryParams();
      const response = await fetch(
        `${BASE_URL}/api/provider/invoices/GetAllByDealerId/${invoice}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const dataUser = await response.json();
      setUser(dataUser);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= user?.totalPages) {
      setPage(newPage);
    }
  };

  const toggleHistory = (index) => {
    setHistoryVisible(historyVisible === index ? null : index);
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedOrder(null);
  };

  const handleOrderClick = async (item) => {
    try {
      const orderId = item.order.id;
      if (!orderId) return;

      const response = await fetch(
        `${BASE_URL}/api/provider/orders/${orderId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Không thể lấy chi tiết đơn hàng.");
      }

      const result = await response.json();
      setSelectedOrder(result);
      setCurrentView("details");
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value, 10));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      {currentView === "list" ? (
        <div className="p-3" style={{ height: "100vh" }}>
          <div>
            <div>
              <div className="d-flex align-items-center mb-2">
                <button className="btn btn-secondary me-2" onClick={onClose}>
                  Quay lại
                </button>
                <h3 className="mb-0">Chi tiết khoản nợ</h3>
              </div>
            </div>
          </div>
          <div className="mb-2">
            <strong>Tên khách hàng:</strong>
            <span className="ms-2">{user?.content[0]?.agent.name}</span>
            <br />
            <strong>Email:</strong>
            <span className="ms-2">{user?.content[0]?.agent.email}</span>
          </div>

          {/* Tìm kiếm và các select */}
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <input
              type="text"
              className="form-control me-2 flex-grow-1"
              placeholder="Tìm kiếm bằng mã khoản nợ"
              value={searchTerm}
              onChange={handleSearch}
              style={{ maxWidth: "1200px" }}
            />

            <div className="d-flex">
              {/* Select số lượng dữ liệu trên trang */}
              <select
                className="form-select me-2"
                value={pageSize}
                onChange={handlePageSizeChange}
                style={{ minWidth: "120px" }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>

              {/* Select sắp xếp */}
              <select
                className="form-select"
                value={sortOrder}
                onChange={handleSortChange}
                style={{ minWidth: "120px" }}
              >
                <option value="DESC">Mới nhất</option>
                <option value="ASC">Cũ nhất</option>
              </select>
            </div>
          </div>

          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã khoản nợ</th>
                <th>Ngày đặt hàng</th>
                <th>Ngày giao hàng</th>
                <th>Số tiền cần thanh toán</th>
                <th>Số tiền đã trả</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            {user?.content?.map((u, index) => (
              <tbody key={u.id}>
                <tr>
                  <td>{index + 1}</td>
                  <td
                    onClick={() => handleOrderClick(u)}
                    style={{ cursor: "pointer" }}
                  >
                    {u.invoiceCode}
                  </td>
                  <td>
                    {new Date(u.createdAt).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    {new Date(u.deliveryDate).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>{" "}
                  <td className="text-right">
                    {u.totalAmount.toLocaleString()} VNĐ
                  </td>
                  <td
                    className="text-right"
                    onClick={() => toggleHistory(index)}
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    {u.paidAmount.toLocaleString()} VNĐ
                  </td>
                  <td>
                    {u.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                  </td>
                </tr>
                {historyVisible === index && (
                  <tr>
                    <td colSpan="7">
                      <h5 className="mt-1">Lịch sử giao dịch:</h5>
                      {u.debtPayments?.length > 0 ? (
                        <table className="table table-bordered mb-5">
                          <thead>
                            <tr>
                              <th>STT</th>
                              <th>Thời gian giao dịch</th>
                              <th>Số tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            {u?.debtPayments?.map((d) => (
                              <tr key={d.id}>
                                <td>{d.id}</td>
                                <td>
                                  {new Date(d.paymentDate).toLocaleString(
                                    "vi-VN",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }
                                  )}
                                </td>
                                <td>{d.amountPaid}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>Không có giao dịch</p>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            ))}
          </table>

          <div className="row mt-8">
            <div className="col">
              <nav>
                <ul className="pagination">
                  {/* Nút Previous */}
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

                  {/* Hiển thị số trang */}
                  {[...Array(user?.totalPages)].map((_, index) => {
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

                  {/* Nút Next */}
                  <li
                    className={`page-item ${
                      page === user?.totalPages ? "disabled" : ""
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

export default InvoiceDetails;
