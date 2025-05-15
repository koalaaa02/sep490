import React, { useEffect, useState } from "react";
import { Table, Container, Badge, Row, Col, Form } from "react-bootstrap";
import { BASE_URL } from "../../../Utils/config";
import { Link } from "react-router-dom";
import OrderDetails from "./OrderDetail";
import { FaSearch } from "react-icons/fa";

const DeliveryList = () => {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentView, setCurrentView] = useState("list");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const token = sessionStorage.getItem("access_token");
  const [searchTerm, setSearchTerm] = useState("");
  const convertUnitToVietnamese = (unit) => {
    const unitMap = {
      PCS: "Chiếc",
      KG: "Kilogram",
      PAIR: "Cặp",
      SET: "Bộ",
      PACK: "Gói",
      BAG: "Túi",
      DOZEN: "Chục",
      BOX: "Hộp",
      TON: "Tấn",
    };
    return unitMap[unit] || unit;
  };

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

  const filteredData = data?.content?.filter((item) =>
    item.deliveryNote.deliveryCode
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {currentView === "list" ? (
        <Container className="mt-4" style={{ height: "100vh" }}>
          <h3 className="mb-4">Phiếu giao hàng</h3>

          {/* Dropdown chọn page size - căn phải */}
          <Row className="mb-3 justify-content-end">
            <Col className="d-flex align-items-center">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm mã giao hàng..."
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

          <Table striped hover responsive>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã giao hàng</th>
                <th>Ngày tạo phiếu</th>
                <th>Tên sản phẩm</th>
                <th>Mã sản phẩm</th>
                <th>Đơn vị</th>
                <th>Tổng tiền</th>
                <th>Giao hàng</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((item, index) => (
                <tr
                  key={item.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOrderClick(item)}
                >
                  <td>{(page - 1) * pageSize + index + 1}</td>
                  <td>{item.deliveryNote.deliveryCode}</td>
                  <td>
                    {new Date(item.deliveryNote.createdAt).toLocaleDateString(
                      "vi-VN"
                    )}
                  </td>
                  <td>{item.productName}</td>
                  <td>{item.productSKUCode}</td>
                  <td>{convertUnitToVietnamese(item.unit)}</td>
                  <td className="text-right">{(item.quantity * item.price).toLocaleString()} VNĐ</td>
                  <td >
                    <Badge
                      bg={
                        item.deliveryNote?.delivered ? "secondary" : "success"
                      }
                    >
                      {item.deliveryNote?.delivered ? "Chưa giao" : "Đã giao"}
                    </Badge>
                  </td>
                  {/* <td>
                    <Badge bg={item.deliveryNote?.paid ? "success" : "warning"}>
                      {item.deliveryNote?.paid
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </Badge>
                  </td> */}
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
