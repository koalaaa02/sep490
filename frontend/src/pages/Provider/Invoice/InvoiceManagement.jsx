import React, { useEffect, useState } from "react";
import { FaSearch, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { BASE_URL } from "../../../Utils/config";
import InvoiceDetails from "./InvoiceDetail";

const InvoiceListComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("access_token");
  const [data, setData] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/provider/invoices/UserInvoiceSummary`,
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

  return (
    <div className="p-3 mb-10" style={{ height: "100vh" }}>
      {selectedInvoice ? (
        <InvoiceDetails
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      ) : (
        <>
          <h3>Danh sách khoản nợ</h3>
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
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>STT</th>
                <th>Ngày đặt hàng</th>
                <th>Tên khách hàng</th>
                <th>Số tiền cần thanh toán</th>
                <th>Ngày giao hàng</th>
                <th>Số tiền đã trả</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((invoice, index) => (
                <tr key={invoice.id}>
                  <td>{index + 1}</td>
                  <td>21:00 04/04/2025</td>
                  <td
                    className="text-primary cursor-pointer"
                    onClick={() => {
                      setSelectedInvoice(invoice.userId);
                    }}
                  >
                    {invoice.firstName || "user"}
                  </td>
                  <td>{invoice.totalAmount}</td>
                  <td>21:00 04/04/2025</td>
                  <td>{invoice.paidAmount}</td>
                  <td>
                    {invoice.paidPercentage > 100
                      ? "Đã thanh toán"
                      : `Đã thanh toán ${invoice.paidPercentage}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav>
            <ul className="pagination">
              <li className="page-item">
                <button className="page-link">Trước</button>
              </li>
              <li className="page-item active">
                <button className="page-link">1</button>
              </li>
              <li className="page-item">
                <button className="page-link">2</button>
              </li>
              <li className="page-item">
                <button className="page-link">3</button>
              </li>
              <li className="page-item">
                <button className="page-link">4</button>
              </li>
              <li className="page-item">
                <button className="page-link">Sau</button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

export default InvoiceListComponent;
