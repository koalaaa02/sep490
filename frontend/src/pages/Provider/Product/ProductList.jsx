import React, { useEffect, useState } from "react";
import { FaSearch, FaStore } from "react-icons/fa";
import { BASE_URL } from "../../../Utils/config";
import { Link } from "react-router-dom";

const ProductList = ({ setSelectedProductId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("access_token");
  const [data, setData] = useState(null);
  const [products, setProducts] = useState(null);
  const [page, setPage] = useState(1);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (data?.id) {
      const delayDebounceFn = setTimeout(() => {
        fetchProducts(searchTerm);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm, data?.id, isActive]);

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
        size: 15,
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

  return (
    <div className="p-3 mb-10">
      <div className="p-3 shadow bg-light rounded">
        <div className="d-flex align-items-center">
          <img
            // src={data.registrationCertificateImages}
            alt="Shop Logo"
            className="rounded-circle me-3"
            width="80"
            height="80"
          />
          <p>Tên cửa hàng: {data?.name}</p>
        </div>
        <div className="d-flex align-items-center">
          <p>Shop type: {data?.shopType}</p>
        </div>
        <div className="d-flex align-items-center">
          <p>Địa chỉ: {data?.address?.address}</p>
        </div>
        <div className="d-flex align-items-center">
          <p>Số điện thoại: {data?.address?.phone}</p>
        </div>
        <hr />

        <div className="d-flex flex-wrap justify-content-between">
          <p>
            <FaStore /> Sản Phẩm: <strong>{data?.products?.length}</strong>
          </p>
        </div>
      </div>
      <h5 className="mb-3 mt-3">Danh sách sản phẩm</h5>
      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Tìm kiếm sản phẩm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-dark">
          <FaSearch />
        </button>
      </div>
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
            <th>ID</th>
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
