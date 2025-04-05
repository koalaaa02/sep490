import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../Utils/config";
import { Link } from "react-router-dom";

const InvoiceDetails = ({ invoice, onClose }) => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("access_token");
  const [page, setPage] = useState(1);
  const [historyVisible, setHistoryVisible] = useState(null);

  const params = new URLSearchParams({
    page: page,
    size: 10,
    sortBy: "id",
    direction: "ASC",
    // agentName: "string",
    // status: "UNPAID",
  });

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async (id) => {
    try {
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

  return (
    <div className="mt-4 p-3 border rounded shadow-lg">
      <div>
        <div className="d-flex align-items-center mb-2">
          <button className="btn btn-secondary me-2" onClick={onClose}>
            Quay lại
          </button>
          <h3 className="mb-0">Chi tiết hóa đơn</h3>
        </div>
      </div>
      <h4>Tên khách hàng: {user?.content[0]?.agent.name}</h4>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã đơn hàng</th>
            <th>Ngày đặt hàng</th>
            <th>Số tiền cần thanh toán</th>
            <th>Ngày giao hàng</th>
            <th>Số tiền đã trả</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        {user?.content?.map((u, index) => (
          <tbody>
            <tr>
              <td>{index + 1}</td>
              <td>5KX3ELQ91V</td>
              <td>
                {new Date(u.createdAt).toLocaleString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td>{u.totalAmount}</td>
              <td>21:00 04/04/2025</td>
              <td
                onClick={() => toggleHistory(index)}
                style={{ cursor: "pointer", color: "blue" }}
              >
                {u.paidAmount}
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
                              {new Date(d.paymentDate).toLocaleString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
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
              {[...Array(user?.totalPages)]?.map((_, index) => {
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
  );
};
export default InvoiceDetails;
