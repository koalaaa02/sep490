import React, { useState } from "react";

const AddProduct = ({ onAddProduct, onCancel }) => {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    price: "",
    description: "",
    images: [],
  });

  const [productImages, setProductImages] = useState([]);
  const [coverImage, setCoverImage] = useState(null);

  // Xử lý thêm ảnh sản phẩm
  const handleProductImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setProductImages((prev) => [...prev, ...newImages]);
  };

  // Xóa ảnh sản phẩm
  const handleRemoveProductImage = (index) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Xử lý ảnh bìa
  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!product.name || !product.price) {
      alert("Vui lòng nhập tên sản phẩm và giá!");
      return;
    }
    onAddProduct(product);
    setProduct({
      name: "",
      category: "",
      quantity: 0,
      unit: "",
      price: "",
      description: "",
      images: [],
    });
  };

  const handleCancel = () => {
    setProduct({
      name: "",
      category: "",
      quantity: 0,
      unit: "",
      price: "",
      description: "",
      images: [],
    });
    onCancel();
  };

  return (
    <div className="p-3 mb-10">
      <h2 className="mb-3">Thêm sản phẩm mới</h2>
      <div className="border p-3 rounded">
        {/* Hình ảnh sản phẩm */}
        <div className="mb-3">
          <label className="form-label fw-bold">Hình ảnh sản phẩm:</label>
          <div className="d-flex flex-wrap align-items-center">
            {productImages.map((image, index) => (
              <div key={index} className="position-relative me-2">
                <img
                  src={image}
                  alt="product preview"
                  className="border rounded"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-danger position-absolute top-0 end-0"
                  onClick={() => handleRemoveProductImage(index)}
                >
                  x
                </button>
              </div>
            ))}
            {/* Nút thêm ảnh */}
            <label
              className="d-flex flex-column align-items-center justify-content-center border rounded bg-white"
              style={{ width: "120px", height: "120px", cursor: "pointer" }}
            >
              <span>+</span>
              <span>Photo</span>
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleProductImageUpload}
              />
            </label>
          </div>
          <p className="text-muted small">Click "Add Photo" để thêm ảnh.</p>
        </div>

        {/* Ảnh bìa */}
        <div className="mb-3">
          <label className="form-label fw-bold">Ảnh bìa:</label>
          <div className="d-flex align-items-center">
            {coverImage ? (
              <img
                src={coverImage}
                alt="cover"
                className="border rounded"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            ) : (
              <label
                className="d-flex flex-column align-items-center justify-content-center border rounded bg-white"
                style={{ width: "120px", height: "120px", cursor: "pointer" }}
              >
                <span>+</span>
                <span>Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleCoverImageUpload}
                />
              </label>
            )}
          </div>
          <p className="text-muted small">* Ảnh bìa sẽ hiển thị đầu tiên.</p>
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
              required
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
              required
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
          />
        </div>

        {/* Nút Lưu và Hủy */}
        <button className="btn btn-success me-2" onClick={handleSave}>
          Lưu sản phẩm
        </button>
        <button className="btn btn-danger" onClick={handleCancel}>
          Hủy
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
