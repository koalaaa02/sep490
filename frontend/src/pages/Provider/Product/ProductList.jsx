import React, { useEffect, useState } from "react";
import { FaEdit, FaSearch } from "react-icons/fa";
import { BASE_URL } from "../../../Utils/config";
import { Link } from "react-router-dom";
import { Row, Col, Form } from "react-bootstrap";
import EditShopModal from "../../../Component/EditShopModal.tsx";

const ProductList = ({ setSelectedProductId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const token = sessionStorage.getItem("access_token");
  const [data, setData] = useState(null);
  const [address, setAddress] = useState(null);
  const [products, setProducts] = useState(null);
  const [page, setPage] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [rf, setRF] = useState(true);
  const fileInputRef = React.useRef(null);
  const fileInputRef2 = React.useRef(null);
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
  }, [searchTerm, data?.id, isActive, page, pageSize, rf]);

  useEffect(() => {
    fetchShopData();
  }, [page, rf]);

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
    if (!data?.id) {
      return;
    }
    try {
      const params = new URLSearchParams({
        page: page,
        size: pageSize,
        sortBy: "id",
        direction: "ASC",
        stop: isActive,
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
    setIsActive(false);
  };

  const handleInactive = () => {
    setIsActive(true);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };
  const handleUploadFile = async (file, uploadType) => {
    const formData = new FormData();
    formData.append("file", file);

    let endpoint;
    let stateField;
    console.log(uploadType);

    switch (uploadType) {
      case "registrationCertificate":
        endpoint = "uploadRegistrationCertificate";
        stateField = "citizenIdentificationCardImageDown";
        break;
      case "shopLogo":
        endpoint = "uploadLogoShop";
        stateField = "shopLogo";
        break;
      case "CitizenIdentityCardUp":
        endpoint = "uploadCitizenIdentityCardUp";
        stateField = "CitizenIdentityCardUp";
        break;
      case "CitizenIdentityCardDown":
        endpoint = "uploadCitizenIdentityCardDown";
        stateField = "CitizenIdentityCardDown";
        break;
      default:
        throw new Error(`Unknown upload type: ${uploadType}`);
    }

    const url = `${BASE_URL}/api/provider/shops/${endpoint}`;

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
        setRF(!rf);
        setEditableUser((prev) => ({
          ...prev,
          [stateField]: data.url,
        }));
      } else {
        alert("Upload thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Không thể upload ảnh.");
    }
  };
  const handleFileChange = (e, uploadType) => {
    const file = e.target.files[0];
    if (file) {
      handleUploadFile(file, uploadType);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/addresses/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const result = await response.json();
        setAddress(result?.content);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchData();
  }, []);
  console.log(data);

  return (
    <div className="p-3 mb-10">
      

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
              !isActive ? "btn-success" : "btn-outline-success"
            } me-2`}
            onClick={handleActive}
          >
            Kích hoạt
          </button>
          <button
            className={`btn ${isActive ? "btn-danger" : "btn-outline-danger"}`}
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
