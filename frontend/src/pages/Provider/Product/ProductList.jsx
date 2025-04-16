import React, { useEffect, useState } from "react";
import { FaSearch, FaStore } from "react-icons/fa";
import { BASE_URL } from "../../../Utils/config";
import { Link } from "react-router-dom";
import { Row, Col, Form } from "react-bootstrap";

const ProductList = ({ setSelectedProductId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("access_token");
  const [data, setData] = useState(null);
  const [products, setProducts] = useState(null);
  const [page, setPage] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [editableUser, setEditableUser] = useState({
    citizenIdentificationCard: "",
  });

  useEffect(() => {
    if (data?.id) {
      const delayDebounceFn = setTimeout(() => {
        fetchProducts(searchTerm);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm, data?.id, isActive, page, pageSize]);

  useEffect(() => {
    fetchShopData();
  }, [page]);

  const fetchShopData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/provider/shops/myshop`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();
      setData(result);

      if (result?.id) {
        fetchProducts("");
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
  };

  const fetchProducts = async (search) => {
    try {
      const params = new URLSearchParams({
        page: page,
        size: pageSize,
        sortBy: "id",
        direction: "ASC",
        active: isActive,
        shopId: data?.id,
      });

      if (search) {
        params.append("name", search);
      }

      const responsePro = await fetch(
        `${BASE_URL}/api/provider/products/?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const resultPro = await responsePro.json();
      setProducts(resultPro);
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
  };

  const totalPages = products?.totalElements
    ? Math.ceil(products?.totalElements / 15)
    : 0;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

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

  const handleActive = () => {
    setIsActive(true);
  };

  const handleInactive = () => {
    setIsActive(false);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const handleUploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const url = `${BASE_URL}/api/provider/shops/uploadRegistrationCertificate`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setEditableUser((prev) => ({
          ...prev,
          citizenIdentificationCardImageDown: data.url,
        }));
      } else {
        alert("Upload thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Không thể upload ảnh.");
    }
  };

  const handleUploadShopLogo = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const url = `${BASE_URL}/api/provider/shops//uploadLogoShop`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setEditableUser((prev) => ({
          ...prev,
          citizenIdentificationCardImageDown: data.url,
        }));
      } else {
        alert("Upload thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Không thể upload ảnh.");
    }
  };

  return (
    <div className="p-3 mb-10">
      <div className="p-3 shadow bg-light rounded">
        <div className="row">
          {/* Cột trái: Thông tin cơ bản */}
          <div className="col-md-6 mb-3">
            <div className="d-flex align-items-center mb-3">
              <label
                htmlFor="uploadShopLogoInput"
                style={{ cursor: "pointer", marginBottom: 0 }}
              >
                <img
                  src={data?.logoImageda}
                  alt="Shop Logo"
                  className="rounded-circle me-3"
                  width="80"
                  height="80"
                />
              </label>

              <input
                id="uploadShopLogoInput"
                type="file"
                accept="image/*"
                onChange={(e) => handleUploadShopLogo(e.target.files[0])}
                style={{ display: "none" }}
              />

              <p className="mb-0">
                <strong>Tên cửa hàng:</strong> {data?.name}
              </p>
            </div>

            <p>
              <strong>Hình thức kinh doanh:</strong>{" "}
              {data?.shopType === "ENTERPRISE"
                ? "Doanh nghiệp lớn"
                : "Doanh nghiệp nhỏ"}
            </p>

            <p>
              <strong>Địa chỉ:</strong> {data?.address?.address},
              {data?.address?.ward},{data?.address?.district},
              {data?.address?.province}
            </p>

            <p>
              <strong>Số điện thoại:</strong> {data?.address?.phone}
            </p>
          </div>

          {/* Cột phải: Giấy phép + Thống kê */}
          <div className="col-md-6 mb-3">
            <div className="d-flex flex-column align-items-start mb-3">
              <p>
                <strong>Mã số thuế:</strong> {data?.tin}
              </p>
              <label className="form-label mb-2">
                <strong>Giấy phép kinh doanh:</strong>
              </label>

              <label htmlFor="uploadImageInput" style={{ cursor: "pointer" }}>
                <img
                  src={
                    data?.registrationCertificateImages || "default-image.jpg"
                  }
                  alt="Giấy phép kinh doanh"
                  style={{
                    width: "100px",
                    marginBottom: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              </label>

              <input
                id="uploadImageInput"
                type="file"
                accept="image/*"
                onChange={(e) => handleUploadImage(e.target.files[0])}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="d-flex flex-wrap justify-content-between">
          <p className="mb-0">
            <strong>Số lượng sản phẩm:</strong> {products?.totalElements}
          </p>
        </div>
      </div>

      <h5 className="mb-3 mt-3">Danh sách sản phẩm</h5>
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
      <div className="mb-2">
        <label>Trạng thái:</label>
        <div>
          <button
            className={`btn ${
              isActive ? "btn-success" : "btn-outline-success"
            } me-2`}
            onClick={handleActive}
          >
            Kích hoạt
          </button>
          <button
            className={`btn ${!isActive ? "btn-danger" : "btn-outline-danger"}`}
            onClick={handleInactive}
          >
            Chưa kích hoạt
          </button>
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Ảnh</th>
            <th>Danh mục</th>
            <th>Mô tả</th>
            <th>Thông số kỹ thuật</th>
            <th>Đơn vị</th>
            <th>Ngày thêm</th>
          </tr>
        </thead>
        <tbody>
          {products?.content?.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedProductId(product.id)}
                className="text-primary"
              >
                {product.name}
              </td>
              <td>
                <img
                  src={product.images}
                  alt=""
                  style={{ height: "50px", width: "50px" }}
                  className="rounded"
                />
              </td>
              <td>{product.category.name || "Không có"}</td>
              <td title={product.description}>
                {product.description.length > 50
                  ? product.description.substring(0, 50) + "..."
                  : product.description}
              </td>
              <td>{product.specifications}</td>
              <td>{convertUnitToVietnamese(product.unit)}</td>
              <td>
                {new Date(product.createdAt).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
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
    </div>
  );
};

export default ProductList;
