import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../Utils/config";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Alert, Button, Form, Modal } from "react-bootstrap";

const AddProduct = ({ onAddProduct, onCancel }) => {
  const token = sessionStorage.getItem("access_token");
  const shopId = useSelector((state) => state.shop.shopId);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contactEmail: "",
    phone: "",
    address: "",
  });
  const [product, setProduct] = useState({
    name: "",
    description: "",
    specifications: "",
    unit: "PCS",
    images: "string",
    active: false,
    unitAdvance: "",
    categoryId: "",
    supplierId: "",
    shopId: shopId,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const params = new URLSearchParams({
          page: 1,
          size: 100,
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
        const response2 = await fetch(
          `${BASE_URL}/api/provider/suppliers/?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response2.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setCategories(data);
        const data2 = await response2.json();
        setSuppliers(data2?.content);
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

      const responseData = await response.json();
      if (!response.ok) {
        console.error("Lỗi API:", responseData);
        alert(
          "Lỗi khi thêm sản phẩm: " +
            (responseData.message || "Không rõ nguyên nhân")
        );
        return;
      }
      onAddProduct(responseData);
      setProduct({
        name: "",
        description: "",
        specifications: "",
        unit: "PCS",
        images: "",
        active: false,
        unitAdvance: "",
        categoryId: "",
        supplierId: "",
        shopId: shopId,
      });

      setProductImages([]);

      alert("Thêm sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi thêm sản phẩm:", error);
      alert("Thêm sản phẩm thất bại!\n" + error.message);
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
  const handleCreateSupplier = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/provider/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSupplier),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        setError(errorDetails);

        return;
      }

      // Success handling
      setShowModal(false);
      alert("Tạo supplier thành công");
      setSuppliers([...suppliers, await response.json()]);
      setNewSupplier({
        name: "",
        contactEmail: "",
        phone: "",
        address: "",
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
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
          <div className="col-md-12">
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
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Tên nhà phân phối:</label>
            {suppliers?.length > 0 ? (
              <select
                className="form-control"
                name="supplierId"
                onChange={handleChange}
                value={product.supplierId}
              >
                <option value="">-- Chọn nhà cung cấp --</option>
                {suppliers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="d-flex flex-column gap-2">
                <div className="text-danger">Chưa có nhà cung cấp nào</div>
                <Button
                  onClick={() => setShowModal(true)}
                  className="btn btn-primary"
                >
                  <i className="fas fa-plus me-2"></i>
                  Thêm nhà cung cấp mới
                </Button>
              </div>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Danh mục:</label>
            <select
              className="form-control"
              name="categoryId"
              onChange={handleChange}
              value={product.categoryId}
            >
              <option value="">-- Chọn danh mục --</option>
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
                  {convertUnitToVietnamese(unit)}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Tính theo đơn vị:</label>
            <input
              type="text"
              className="form-control"
              name="unitAdvance"
              value={product.unitAdvance}
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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm nhà đối tác</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {error?.name && <Alert variant="danger">{error?.name}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                value={newSupplier?.name}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, name: e.target.value })
                }
              />
            </Form.Group>
            {error?.contactEmail && (
              <Alert variant="danger">{error?.contactEmail}</Alert>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newSupplier.contactEmail}
                onChange={(e) =>
                  setNewSupplier({
                    ...newSupplier,
                    contactEmail: e.target.value,
                  })
                }
              />
            </Form.Group>
            {error?.phone && <Alert variant="danger">{error?.phone}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="tel"
                value={newSupplier.phone}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, phone: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newSupplier.address}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, address: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleCreateSupplier}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddProduct;
