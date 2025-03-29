import React, { useEffect, useState } from "react";
import { FaSearch, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { BASE_URL } from "../../../Utils/config";
import InvoiceDetails from "./InvoiceDetail";

const InvoiceListComponent = () => {
  const [filter, setFilter] = useState("Tất cả");
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
    <div className="p-3 mb-10">
      {selectedInvoice ? (
        <InvoiceDetails
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      ) : (
        <>
          <h3>Danh sách hóa đơn</h3>
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
            <div>Tổng hóa đơn: {data?.length}</div>
            <div>Tổng tiền: ...</div>
          </div>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Mã khách hàng</th>
                <th>Số tiền đã trả</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.userId}</td>
                  <td>{invoice.paidAmount}</td>
                  <td>{invoice.totalAmount}</td>
                  <td>
                    {invoice.paidPercentage > 100
                      ? "Đã thanh toán"
                      : `Đã thanh toán ${invoice.paidPercentage}%`}
                  </td>
                  <td>
                    <FaEye
                      className="mx-1 text-primary"
                      onClick={() => {
                        setSelectedInvoice(invoice.userId);
                      }}
                    />
                    <FaEdit className="mx-1 text-warning" />
                    <FaTrash className="mx-1 text-danger" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav>
            <ul className="pagination">
              <li className="page-item">
                <button className="page-link">Prev</button>
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
                <button className="page-link">Next</button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

export default InvoiceListComponent;
