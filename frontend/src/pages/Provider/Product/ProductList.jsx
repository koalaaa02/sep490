import React, { useEffect, useState } from "react";
import { FaSearch, FaEye, FaTrash } from "react-icons/fa";
import { BASE_URL } from "../../../Utils/config";

export const products = [
  {
    id: 1,
    name: "string",
    description: "string",
    specifications: "string",
    unit: "PCS",
    images: "string",
    active: true,
    category: {
      id: 1,
      createdBy: 1,
      updatedBy: 1,
      createdAt: "2025-02-23 15:35:19",
      updatedAt: "2025-02-23 16:32:06",
      name: "gạch ốp lát.",
      images:
        "http://localhost:8088/uploads/products/1740325952962_final_logo.png",
      parent: true,
      delete: false,
    },
    skus: [
      {
        createdBy: 2,
        updatedBy: 3,
        createdAt: "2025-02-23 16:47:15",
        updatedAt: "2025-03-12 07:14:01",
        id: 1,
        skuCode: "string",
        stock: 9974,
        costPrice: 0,
        listPrice: 0,
        sellingPrice: 1000000,
        wholesalePrice: 0,
        images: "string",
        bulky: true,
        delete: false,
      },
      {
        createdBy: 2,
        updatedBy: 2,
        createdAt: "2025-02-23 16:47:37",
        updatedAt: "2025-02-23 16:47:37",
        id: 2,
        skuCode: "red",
        stock: 10000,
        costPrice: 0,
        listPrice: 0,
        sellingPrice: 1000000,
        wholesalePrice: 0,
        images: "string",
        bulky: true,
        delete: false,
      },
      {
        createdBy: 2,
        updatedBy: 2,
        createdAt: "2025-02-23 16:47:46",
        updatedAt: "2025-02-23 16:47:46",
        id: 3,
        skuCode: "blue",
        stock: 10000,
        costPrice: 0,
        listPrice: 0,
        sellingPrice: 1000000,
        wholesalePrice: 0,
        images: "string",
        bulky: true,
        delete: false,
      },
    ],
  },
];

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
            <th>SKU</th>
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
              <td>
                {product.skus
                  .reduce((total, sku) => total + sku.stock, 0)
                  .toLocaleString()}
              </td>
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
