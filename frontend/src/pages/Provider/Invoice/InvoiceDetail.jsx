import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../Utils/config";
import { Link } from "react-router-dom";

const InvoiceDetails = ({ invoice, onClose }) => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("access_token");
  const [page, setPage] = useState(1);

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

  return (
    <div className="mt-4 p-3 border rounded shadow-lg">
      <div>
        <button className="btn btn-secondary mb-2" onClick={onClose}>
          Quay lại
        </button>
        <h2>Chi tiết hóa đơn</h2>
      </div>
      {user?.content?.map((u) => (
        <>
          <h5>Tên khách hàng: {u.agent.name}</h5>
          <h5>Tổng tiền: {u.totalAmount}</h5>
          <h5>Tiền đã trả: {u.paidAmount}</h5>
          <h5>Trạng thái: {u.status}</h5>
          <h5>Chi tiết giao dịch:</h5>
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
                {u.debtPayments.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>
                      {new Date(d.paymentDate)
                        .toLocaleString("sv-SE", {
                          timeZone: "Asia/Ho_Chi_Minh",
                        })
                        .slice(0, 16)}
                    </td>
                    <td>{d.amountPaid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Không có giao dịch</p>
          )}
        </>
      ))}
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
                className={`page-item ${page === user?.totalPages ? "disabled" : ""}`}
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
