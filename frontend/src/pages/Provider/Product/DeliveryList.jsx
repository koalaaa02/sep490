import React, { useEffect, useState } from "react";
import { Table, Container, Badge, Row, Col, Form } from "react-bootstrap";
import { BASE_URL } from "../../../Utils/config";
import { Link } from "react-router-dom";
import OrderDetails from "./OrderDetail";

const DeliveryList = () => {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentView, setCurrentView] = useState("list");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const token = localStorage.getItem("access_token");

  const fetchData = async (currentPage) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/provider/deliverydetails/?page=${currentPage}&size=${pageSize}&sortBy=id&direction=ASC`,
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
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page, pageSize]);

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

  const handleOrderClick = async (item) => {
    try {
      const orderId = item.orderDetailId?.orderId;
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

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedOrder(null);
  };

  return (
    <>
      {currentView === "list" ? (
        <Container className="mt-4" style={{ height: "100vh" }}>
          <h3 className="mb-4">Phiếu giao hàng</h3>

          {/* Dropdown chọn page size - căn phải */}
          <Row className="mb-3 justify-content-end">
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

          <Table striped hover responsive>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã giao hàng</th>
                <th>Tên sản phẩm</th>
                <th>Mã sản phẩm</th>
                <th>Đơn vị</th>
                <th>Tổng tiền</th>
                <th>Giao hàng</th>
                <th>Thanh toán</th>
              </tr>
            </thead>
            <tbody>
              {data?.content?.map((item, index) => (
                <tr
                  key={item.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOrderClick(item)}
                >
                  <td>{(page - 1) * pageSize + index + 1}</td>
                  <td>{item.deliveryNote.deliveryCode}</td>
                  <td>{item.productName}</td>
                  <td>{item.productSKUCode}</td>
                  <td>{item.unit}</td>
                  <td>{(item.quantity * item.price).toLocaleString()}</td>
                  <td>
                    <Badge
                      bg={
                        item.deliveryNote?.delivered ? "success" : "secondary"
                      }
                    >
                      {item.deliveryNote?.delivered ? "Đã giao" : "Chưa giao"}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={item.deliveryNote?.paid ? "success" : "warning"}>
                      {item.deliveryNote?.paid
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Phân trang */}
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
        </Container>
      ) : (
        <OrderDetails
          order={selectedOrder}
          onBack={handleBackToList}
          fromDeliveryList={true}
        />
      )}
    </>
  );
};

export default DeliveryList;
