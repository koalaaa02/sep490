import React, { useState } from "react";
import { products } from "./ProductList";

const ProductDetail = ({ productId, setSelectedProductId }) => {
  const productData = products.find((p) => p.id === productId);

  const [product, setProduct] = useState({ ...productData });
  const [isEditing, setIsEditing] = useState(false);

  if (!productData) {
    return (
      <div className="p-3 mb-10">
        <h2>Không tìm thấy sản phẩm!</h2>
      </div>
    );
  }

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Dữ liệu sản phẩm sau khi chỉnh sửa:", product);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProduct({ ...productData });
    setIsEditing(false);
  };

  return (
    <div className="p-3 mb-10">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => setSelectedProductId(null)}
      >
        Quay lại danh sách
      </button>
      <h2 className="mb-3">Chi tiết sản phẩm</h2>

      <div className="border p-3 rounded">
        {/* Hình ảnh sản phẩm */}
        <div className="mb-3">
          <label className="form-label fw-bold">Hình ảnh sản phẩm:</label>
          <div className="d-flex">
            {product.images && product.images.length > 0 ? (
              product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`product-${index}`}
                  className="me-2"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
              ))
            ) : (
              <span>Không có hình ảnh</span>
            )}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Tên sản phẩm:</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={product.name}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Phân loại:</label>
            <input
              type="text"
              className="form-control"
              name="category"
              value={product.category}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Số lượng:</label>
            <input
              type="number"
              className="form-control"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Đơn vị:</label>
            <input
              type="text"
              className="form-control"
              name="unit"
              value={product.unit}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Đơn giá:</label>
            <input
              type="text"
              className="form-control"
              name="price"
              value={product.price}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Mô tả sản phẩm:</label>
          <textarea
            className="form-control"
            name="description"
            rows="3"
            value={product.description}
            onChange={handleChange}
            readOnly={!isEditing}
            style={{ height: "120px" }}
          />
        </div>

        {/* Nút Chỉnh sửa, Lưu, Hủy */}
        {!isEditing ? (
          <button
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            Chỉnh sửa
          </button>
        ) : (
          <>
            <button className="btn btn-success me-2" onClick={handleSave}>
              Lưu
            </button>
            <button className="btn btn-danger" onClick={handleCancel}>
              Hủy
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
