import React, { useState } from "react";
import { FaSearch, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const products = [
  {
    id: "001",
    name: "Xi măng ABC",
    description:
      "Xi măng của công ty ABC có độ bền cao, khả năng kết dính tốt và chịu lực tốt, phù hợp cho các công trình xây dựng...",
    price: "75.000/bao",
    quantity: 88888,
  },
  {
    id: "002",
    name: "Gạch lót nền",
    description:
      "Gạch lót nền của công ty 123 có thiết kế đa dạng, độ bền cao và khả năng chịu lực tốt...",
    price: "120.000/1m2",
    quantity: 99999,
  },
  {
    id: "003",
    name: "Thép XYZ",
    description:
      "Thép XYZ có độ cứng cao, khả năng chịu lực lớn và chống ăn mòn tốt...",
    price: "14.000/kg",
    quantity: 9999,
  },
];

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredProducts = products.filter(
    (p) =>
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.includes(searchTerm)) &&
      (filter === "all" ||
        (filter === "unpaid" && p.quantity > 50000) ||
        (filter === "paid" && p.quantity <= 50000))
  );

  return (
    <div className="container mt-4">
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

      <div className="mb-3">
        <button
          className="btn btn-outline-primary me-2"
          onClick={() => setFilter("all")}
        >
          Tất cả
        </button>
        <button
          className="b  tn btn-outline-warning me-2"
          onClick={() => setFilter("unpaid")}
        >
          Chưa thanh toán
        </button>
        <button
          className="btn btn-outline-success"
          onClick={() => setFilter("paid")}
        >
          Đã thanh toán
        </button>
      </div>

      <div className="mb-3 p-3 border rounded">
        <h5>Thống kê nhanh:</h5>
        <p>Tổng sản phẩm: {filteredProducts.length}</p>
        <p>
          Tổng tiền:{" "}
          {filteredProducts
            .reduce(
              (sum, p) =>
                sum + parseFloat(p.price.replace(/[^0-9]/g, "")) * p.quantity,
              0
            )
            .toLocaleString()}{" "}
          VND
        </p>
      </div>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên sản phẩm</th>
            <th>Mô tả</th>
            <th>Đơn giá/Đơn vị</th>
            <th>Số lượng</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td title={product.description}>
                {product.description.length > 50
                  ? product.description.substring(0, 50) + "..."
                  : product.description}
              </td>
              <td>{product.price}</td>
              <td>{product.quantity.toLocaleString()}</td>
              <td>
                <FaEye className="mx-1 text-primary" />
                <FaEdit className="mx-1 text-warning" />
                <FaTrash className="mx-1 text-danger" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
