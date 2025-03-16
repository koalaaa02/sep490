import React, { useState } from "react";
import { FaSearch, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const InvoiceListComponent = () => {
  const [filter, setFilter] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  const invoices = [
    {
      id: "001",
      date: "10/03/2021",
      customer: "Công ty A",
      amount: "5.000.000.000",
      status: "Đã thanh toán",
    },
    {
      id: "002",
      date: "15/08/2022",
      customer: "Anh Nguyễn Văn A",
      amount: "1.000.000.000",
      status: "Đã cọc 50%",
    },
    {
      id: "003",
      date: "22/01/2024",
      customer: "Công ty B",
      amount: "200.000.000",
      status: "Đã thanh toán",
    },
  ];

  const filteredInvoices = invoices.filter(
    (i) =>
      (filter === "Tất cả" || i.status.includes(filter)) &&
      (i.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.id.includes(searchTerm))
  );

  return (
    <div className="container mt-4">
      <h3>Danh sách hóa đơn</h3>
      <div className="mb-3 d-flex align-items-center">
        <input
          type="text"
          className="form-control mx-2"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-dark">
          <FaSearch />
        </button>
      </div>
      <div className="mb-3">
        <button
          className="btn btn-outline-secondary mx-1"
          onClick={() => setFilter("Tất cả")}
        >
          Tất cả
        </button>
        <button
          className="btn btn-outline-warning mx-1"
          onClick={() => setFilter("Chưa thanh toán")}
        >
          Chưa thanh toán
        </button>
        <button
          className="btn btn-outline-success mx-1"
          onClick={() => setFilter("Đã thanh toán")}
        >
          Đã thanh toán
        </button>
      </div>
      <div className="border p-2 mb-3">
        <strong>Thống kê nhanh:</strong>
        <div>Tổng hóa đơn: {filteredInvoices.length}</div>
        <div>Tổng tiền: ...</div>
      </div>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Ngày tạo</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.date}</td>
              <td>{invoice.customer}</td>
              <td>{invoice.amount}</td>
              <td>{invoice.status}</td>
              <td>
                <FaEye className="mx-1 text-primary" />
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
    </div>
  );
};

export default InvoiceListComponent;
