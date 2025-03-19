import React, { useEffect, useState } from "react";
import { FaSearch, FaEye, FaTrash } from "react-icons/fa";
import { BASE_URL } from "../../../Utils/config";

const ProductList = ({ setSelectedProductId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("access_token");
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: 1,
          size: 10,
          sortBy: "id",
          direction: "ASC",
        });

        const response = await fetch(`${BASE_URL}/api/provider/products/?${params.toString()}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const result = await response.json();
        setData(result.content);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-3 mb-10">
      <h2 className="mb-3">Danh sách sản phẩm</h2>
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

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Mô tả</th>
            <th>Danh mục</th>
            <th>Đơn vị</th>
            <th>Tồn kho</th>
            <th>Giá bán</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td title={product.description}>
                {product.description.length > 50
                  ? product.description.substring(0, 50) + "..."
                  : product.description}
              </td>
              <td>{product.category.name}</td>
              <td>{product.unit}</td>
              <td>{product.skus.map((sku) => sku.skuCode).join(", ")}</td>
              <td>{product.skus[0]?.sellingPrice.toLocaleString()} VND</td>
              <td>
                <FaEye
                  className="mx-1 text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedProductId(product.id)}
                />
                <FaTrash
                  className="mx-1 text-danger"
                  style={{ cursor: "pointer" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
