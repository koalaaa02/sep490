import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { BASE_URL } from "../../../Utils/config";
import InvoiceDetails from "./InvoiceDetail";
import { Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const InvoiceListComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const token = sessionStorage.getItem("access_token");
  const [data, setData] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchData(page);
  }, [page, pageSize]);

  const fetchData = async (currentPage) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/provider/invoices/UserInvoiceSummary?page=${currentPage}&size=${pageSize}&sortBy=id&direction=ASC`,
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

  const filteredData = data?.filter((invoice) =>
    invoice.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = data?.totalElements
    ? Math.ceil(data.totalElements / pageSize)
    : 0;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  return (
    <div
      className="p-3 mb-10"
      style={{ height: selectedInvoice ? "100%" : "100vh" }}
    >
      {selectedInvoice ? (
        <InvoiceDetails
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      ) : (
        <>
          <h3>Danh sách khoản nợ</h3>
          <Row className="mb-3 justify-content-end">
            <Col className="d-flex align-items-center">
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
            </Col>
            <Col xs="auto" className="d-flex align-items-center">
              <Form.Select
                size="sm"
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </Form.Select>
            </Col>
          </Row>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>STT</th>
                <th>Ngày đặt hàng</th>
                <th>Tên khách hàng</th>
                <th>Ngày giao hàng</th>
                <th>Số tiền cần thanh toán</th>
                <th>Số tiền đã trả</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((invoice, index) => (
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
                  <td>21:00 04/04/2025</td>{" "}
                  <td className="text-right">
                    {invoice.totalAmount.toLocaleString()}đ
                  </td>
                  <td className="text-right">
                    {invoice.paidAmount.toLocaleString()}đ
                  </td>
                  <td>
                    {invoice.paidPercentage > 100
                      ? "Đã thanh toán"
                      : `Đã thanh toán ${invoice.paidPercentage}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row mt-4">
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
        </>
      )}
    </div>
  );
};

export default InvoiceListComponent;
