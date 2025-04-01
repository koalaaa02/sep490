import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../Utils/config";

const AddProduct = ({ onAddProduct, onCancel }) => {
  const token = localStorage.getItem("access_token");
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    specifications: "",
    unit: "PCS",
    images: "string",
    active: true,
    categoryId: "",
    supplierId: 1,
    shopId: 1,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const params = new URLSearchParams({
          page: 1,
          size: 10,
          sortBy: "id",
          direction: "ASC",
        });

        const response = await fetch(
          `${BASE_URL}/api/public/categories?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const [productImages, setProductImages] = useState([]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!product.name || !product.description) {
      alert("Vui lòng nhập tên sản phẩm và mô tả!");
      return;
    }

    try {
      const bodyData = {
        ...product,
        images: JSON.stringify(productImages),
      };

      const response = await fetch(`${BASE_URL}/api/provider/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const addedProduct = await response.json();

      if (!response.ok) {
        throw new Error("API trả về lỗi hoặc thiếu dữ liệu!");
      }
      onAddProduct(addedProduct);
      setProduct((prev) => ({
        ...prev,
        name: "",
        description: "",
        specifications: "",
        unit: "PCS",
        images: "",
        active: true,
        categoryId: "",
        supplierId: 1,
        shopId: 1,
      }));

      setProductImages([]);

      alert("Thêm sản phẩm thất bại!");
    } catch (error) {
      alert("Thêm sản phẩm thành công!");
    }
  };

  // Xử lý thêm ảnh sản phẩm
  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProductImages([imageUrl]);
    }
  };

  // Xóa ảnh sản phẩm
  const handleRemoveProductImage = (index) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setProduct({
      name: "",
      categoryId: "",
      quantity: 0,
      unit: "PCS",
      price: "",
      description: "",
      images: "",
      specifications: "",
      active: true,
    });

    setProductImages([]);
    if (typeof onCancel === "function") {
      onCancel();
    }
  };

  return (
    <div className="p-3 mb-10">
      <h3 className="mb-3">Thêm sản phẩm mới</h3>
      <div className="border p-3 rounded">
        {/* Hình ảnh sản phẩm */}
        <div className="mb-3">
          <label className="form-label fw-bold">Hình ảnh sản phẩm:</label>
          <div className="d-flex flex-wrap align-items-center">
            {productImages.length > 0 && (
              <div className="position-relative me-2">
                <img
                  src={productImages[0]}
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
                  onClick={handleRemoveProductImage}
                >
                  x
                </button>
              </div>
            )}
            {productImages.length === 0 && (
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
                  onChange={handleProductImageUpload}
                />
              </label>
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
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Phân loại:</label>
            <select
              className="form-control"
              name="categoryId"
              onChange={handleChange}
              // value={product.categoryId}
            >
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Đơn vị:</label>
            <select
              className="form-control"
              name="unit"
              value={product.unit}
              onChange={handleChange}
            >
              {[
                "PCS",
                "KG",
                "PAIR",
                "SET",
                "PACK",
                "BAG",
                "DOZEN",
                "BOX",
                "TON",
              ].map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
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
          <label className="form-label fw-bold">Thông số sản phẩm:</label>
          <textarea
            className="form-control"
            name="specifications"
            rows="3"
            value={product.specifications}
            onChange={handleChange}
          />
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
