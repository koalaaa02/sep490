import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../Utils/config";
import { useSelector } from "react-redux";
// import { Link } from "react-router-dom"; // Link was not used
import { Alert, Button, Form, Modal } from "react-bootstrap";

const AddProduct = ({ onAddProduct, onCancel }) => {
  const token = sessionStorage.getItem("access_token");
  const shopId = useSelector((state) => state.shop.shopId);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const initialNewSupplierState = {
    name: "",
    contactEmail: "",
    phone: "",
    address: "",
  };
  const [newSupplier, setNewSupplier] = useState(initialNewSupplierState);
  const [supplierApiError, setSupplierApiError] = useState(null); // For general API errors in supplier modal
  const [supplierFormErrors, setSupplierFormErrors] = useState({});

  const initialProductState = {
    name: "",
    description: "",
    specifications: "",
    unit: "PCS",
    // images: "string", // This will be derived from productImages state for submission
    active: false, // Default to false, user can activate if needed
    unitAdvance: "",
    categoryId: "",
    supplierId: "",
    shopId: shopId,
  };
  const [product, setProduct] = useState(initialProductState);
  const [productFormErrors, setProductFormErrors] = useState({});
  const [productImages, setProductImages] = useState([]); // Stores image preview URLs or File objects

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const params = new URLSearchParams({
          page: 1,
          size: 100, // Fetch a reasonable number for dropdowns
          sortBy: "id",
          direction: "ASC",
        });

        // Fetch Categories
        const categoriesResponse = await fetch(
          `${BASE_URL}/api/public/categories?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!categoriesResponse.ok) {
          console.error(
            "Failed to fetch categories:",
            categoriesResponse.statusText
          );
          throw new Error("Network response was not ok for categories");
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData || []); // Ensure categories is an array

        // Fetch Suppliers
        const suppliersResponse = await fetch(
          `${BASE_URL}/api/provider/suppliers/?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!suppliersResponse.ok) {
          console.error(
            "Failed to fetch suppliers:",
            suppliersResponse.statusText
          );
          throw new Error("Network response was not ok for suppliers");
        }
        const suppliersData = await suppliersResponse.json();
        setSuppliers(suppliersData?.content || []); // Ensure suppliers is an array
      } catch (error) {
        console.error("Error fetching initial data:", error);
        // Optionally set an error state here to display to the user
      }
    };
    if (token && shopId) {
      // Ensure token and shopId are available
      fetchInitialData();
    }
  }, [token, shopId]); // Added token and shopId as dependencies

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear validation error for the field being changed
    if (productFormErrors[name]) {
      setProductFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const handleNewSupplierChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [name]: value }));
    if (supplierFormErrors[name]) {
      setSupplierFormErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (supplierApiError) setSupplierApiError(null); // Clear general API error on input change
  };

  const validateProductForm = () => {
    const errors = {};
    if (!product.name.trim()) errors.name = "Tên sản phẩm không được để trống.";
    if (!product.description.trim())
      errors.description = "Mô tả sản phẩm không được để trống.";
    if (!product.categoryId) errors.categoryId = "Vui lòng chọn danh mục.";
    if (!product.supplierId) errors.supplierId = "Vui lòng chọn nhà cung cấp.";
    if (!product.unitAdvance.trim())
      errors.unitAdvance = "Tính theo đơn vị không được để trống.";
    // Example: if at least one image is required
    if (productImages.length === 0)
      errors.images = "Vui lòng thêm ít nhất một hình ảnh sản phẩm.";

    setProductFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateProductForm()) {
      alert(
        "Vui lòng điền đầy đủ các trường bắt buộc và sửa các lỗi được chỉ ra."
      );
      return;
    }

    try {
      const bodyData = {
        ...product,
        images: JSON.stringify(productImages), // Assuming backend expects a JSON string of image URLs/identifiers
        shopId: shopId, // Ensure shopId is correctly included
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
        console.error("Lỗi API khi thêm sản phẩm:", responseData);
        alert(
          "Lỗi khi thêm sản phẩm: " +
            (responseData.message ||
              responseData.error ||
              "Không rõ nguyên nhân")
        );
        // Potentially map specific API errors to productFormErrors if backend provides field-specific errors
        // For example: if (responseData.errors) setProductFormErrors(responseData.errors);
        return;
      }
      onAddProduct(responseData); // Callback with the new product data
      setProduct(initialProductState); // Reset product form
      setProductImages([]); // Reset images
      setProductFormErrors({}); // Clear validation errors
      alert("Thêm sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi thêm sản phẩm:", error);
      alert("Thêm sản phẩm thất bại!\n" + error.message);
    }
  };

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For simplicity, using object URL. In a real app, you'd upload this file
      // and then use the returned URL or identifier.
      const imageUrl = URL.createObjectURL(file);
      setProductImages([imageUrl]); // Assuming only one image for now based on UI.
      // If multiple, setProductImages(prev => [...prev, imageUrl]);
      if (productFormErrors.images) {
        setProductFormErrors((prev) => ({ ...prev, images: null }));
      }
    }
  };

  const handleRemoveProductImage = () => {
    // Simplified for a single image
    if (productImages.length > 0) {
      URL.revokeObjectURL(productImages[0]); // Clean up object URL
      setProductImages([]);
    }
  };

  const handleCancel = () => {
    setProduct(initialProductState);
    setProductImages([]);
    setProductFormErrors({});
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

  const validateSupplierForm = () => {
    const errors = {};
    if (!newSupplier.name.trim())
      errors.name = "Tên nhà cung cấp không được để trống.";
    if (!newSupplier.contactEmail.trim()) {
      errors.contactEmail = "Email không được để trống.";
    } else if (!/\S+@\S+\.\S+/.test(newSupplier.contactEmail)) {
      errors.contactEmail = "Email không hợp lệ.";
    }
    if (!newSupplier.phone.trim()) {
      errors.phone = "Số điện thoại không được để trống.";
    } else if (!/^\d{10,11}$/.test(newSupplier.phone)) {
      // Basic Vietnamese phone validation (10-11 digits)
      errors.phone = "Số điện thoại không hợp lệ (yêu cầu 10-11 số).";
    }
    // Address can be optional, add validation if it's required
    // if (!newSupplier.address.trim()) errors.address = "Địa chỉ không được để trống.";

    setSupplierFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSupplier = async () => {
    setSupplierApiError(null); // Clear previous general API errors
    if (!validateSupplierForm()) {
      return; // Stop if client-side validation fails
    }

    try {
      const response = await fetch(`${BASE_URL}/api/provider/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSupplier),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Handle backend validation errors or other API errors
        if (responseData.errors && typeof responseData.errors === "object") {
          // Assuming backend returns errors like { fieldName: "error message" }
          setSupplierFormErrors((prevErrors) => ({
            ...prevErrors,
            ...responseData.errors,
          }));
        } else if (responseData.message) {
          setSupplierApiError(responseData.message);
        } else if (responseData.error) {
          setSupplierApiError(responseData.error);
        } else {
          setSupplierApiError("Đã có lỗi xảy ra khi tạo nhà cung cấp.");
        }
        console.error("API Error creating supplier:", responseData);
        return;
      }

      // Success handling
      const addedSupplier = responseData; // Assuming the response is the new supplier object
      setSuppliers((prevSuppliers) => [...prevSuppliers, addedSupplier]);
      // Automatically select the newly added supplier in the product form
      setProduct((prevProduct) => ({
        ...prevProduct,
        supplierId: addedSupplier.id,
      }));
      if (productFormErrors.supplierId) {
        setProductFormErrors((prev) => ({ ...prev, supplierId: null })); // Clear product form error for supplier
      }

      setShowModal(false);
      alert("Tạo nhà cung cấp thành công!");
      setNewSupplier(initialNewSupplierState); // Reset form
      setSupplierFormErrors({}); // Clear validation errors
      setSupplierApiError(null);
    } catch (err) {
      console.error("Unexpected error creating supplier:", err);
      setSupplierApiError("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
    }
  };

  const openSupplierModal = () => {
    setNewSupplier(initialNewSupplierState);
    setSupplierFormErrors({});
    setSupplierApiError(null);
    setShowModal(true);
  };

  const closeSupplierModal = () => {
    setShowModal(false);
    setNewSupplier(initialNewSupplierState);
    setSupplierFormErrors({});
    setSupplierApiError(null);
  };

  return (
    <div className="p-3 mb-10">
      <h3 className="mb-3">Thêm sản phẩm mới</h3>
      <div className="border p-3 rounded">
        {/* Hình ảnh sản phẩm */}
        <div className="mb-3">
          <label className="form-label fw-bold">Hình ảnh sản phẩm:</label>
          <div className="d-flex flex-wrap align-items-center">
            {productImages.length > 0 ? (
              <div className="position-relative me-2">
                <img
                  src={productImages[0]} // Displaying the first image
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
                  aria-label="Remove image"
                >
                  &times;
                </button>
              </div>
            ) : (
              <label
                className={`d-flex flex-column align-items-center justify-content-center border rounded bg-white ${
                  productFormErrors.images ? "border-danger" : ""
                }`}
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
          {productFormErrors.images && (
            <div className="text-danger mt-1" style={{ fontSize: "0.875em" }}>
              {productFormErrors.images}
            </div>
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="row mb-3">
          <div className="col-md-12">
            <label className="form-label fw-bold" htmlFor="productName">
              Tên sản phẩm:
            </label>
            <input
              id="productName"
              type="text"
              className={`form-control ${
                productFormErrors.name ? "is-invalid" : ""
              }`}
              name="name"
              value={product.name}
              onChange={handleChange}
            />
            {productFormErrors.name && (
              <div className="invalid-feedback">{productFormErrors.name}</div>
            )}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold" htmlFor="supplierId">
              Tên nhà phân phối:
            </label>
            {suppliers && suppliers.length > 0 ? (
              <>
                <select
                  id="supplierId"
                  className={`form-select ${
                    productFormErrors.supplierId ? "is-invalid" : ""
                  }`}
                  name="supplierId"
                  onChange={handleChange}
                  value={product.supplierId}
                >
                  <option value="">-- Chọn nhà cung cấp --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {productFormErrors.supplierId && (
                  <div className="invalid-feedback">
                    {productFormErrors.supplierId}
                  </div>
                )}
              </>
            ) : (
              <div className="d-flex flex-column gap-2">
                <div
                  className={`${
                    productFormErrors.supplierId ? "text-danger" : "text-muted"
                  }`}
                >
                  {productFormErrors.supplierId
                    ? productFormErrors.supplierId
                    : "Chưa có nhà cung cấp nào."}
                </div>
                <Button
                  onClick={openSupplierModal}
                  className="btn btn-primary btn-sm"
                >
                  <i className="fas fa-plus me-2"></i>
                  Thêm nhà cung cấp mới
                </Button>
              </div>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold" htmlFor="categoryId">
              Danh mục:
            </label>
            <select
              id="categoryId"
              className={`form-select ${
                productFormErrors.categoryId ? "is-invalid" : ""
              }`}
              name="categoryId"
              onChange={handleChange}
              value={product.categoryId}
              disabled={!categories || categories.length === 0}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories && categories.length > 0 ? (
                categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Chưa có danh mục nào khả dụng
                </option>
              )}
            </select>
            {productFormErrors.categoryId && (
              <div className="invalid-feedback">
                {productFormErrors.categoryId}
              </div>
            )}
            {(!categories || categories.length === 0) && (
              <div className="text-muted mt-1" style={{ fontSize: "0.875em" }}>
                Không có danh mục nào. Bạn có thể cần phải thêm danh mục trong
                phần quản lý danh mục.
              </div>
            )}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold" htmlFor="unit">
              Đơn vị:
            </label>
            <select
              id="unit"
              className="form-select"
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
                  {convertUnitToVietnamese(unit)} ({unit})
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold" htmlFor="unitAdvance">
              Tính theo đơn vị (VD: 1 thùng 24 lon):
            </label>
            <input
              id="unitAdvance"
              type="text"
              className={`form-control ${
                productFormErrors.unitAdvance ? "is-invalid" : ""
              }`}
              name="unitAdvance"
              value={product.unitAdvance}
              onChange={handleChange}
              placeholder="VD: Thùng, Hộp, Gói..."
            />
            {productFormErrors.unitAdvance && (
              <div className="invalid-feedback">
                {productFormErrors.unitAdvance}
              </div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold" htmlFor="specifications">
            Thông số sản phẩm:
          </label>
          <textarea
            id="specifications"
            className="form-control" // No specific validation for this one in the example, add if needed
            name="specifications"
            rows="3"
            value={product.specifications}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold" htmlFor="description">
            Mô tả sản phẩm:
          </label>
          <textarea
            id="description"
            className={`form-control ${
              productFormErrors.description ? "is-invalid" : ""
            }`}
            name="description"
            rows="3"
            value={product.description}
            onChange={handleChange}
          />
          {productFormErrors.description && (
            <div className="invalid-feedback">
              {productFormErrors.description}
            </div>
          )}
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="active"
            id="productActive"
            checked={product.active}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="productActive">
            Cho phép bán (Active)
          </label>
        </div>

        {/* Nút Lưu và Hủy */}
        <button
          type="button"
          className="btn btn-success me-2"
          onClick={handleSave}
        >
          Lưu sản phẩm
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleCancel}
        >
          Hủy
        </button>
      </div>

      <Modal show={showModal} onHide={closeSupplierModal}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm nhà cung cấp mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate>
            {supplierApiError && (
              <Alert variant="danger">{supplierApiError}</Alert>
            )}
            <Form.Group className="mb-3" controlId="supplierName">
              <Form.Label>Tên nhà cung cấp</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newSupplier.name}
                onChange={handleNewSupplierChange}
                isInvalid={!!supplierFormErrors.name}
                required
              />
              <Form.Control.Feedback type="invalid">
                {supplierFormErrors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="supplierEmail">
              <Form.Label>Email liên hệ</Form.Label>
              <Form.Control
                type="email"
                name="contactEmail"
                value={newSupplier.contactEmail}
                onChange={handleNewSupplierChange}
                isInvalid={!!supplierFormErrors.contactEmail}
                required
              />
              <Form.Control.Feedback type="invalid">
                {supplierFormErrors.contactEmail}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="supplierPhone">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={newSupplier.phone}
                onChange={handleNewSupplierChange}
                isInvalid={!!supplierFormErrors.phone}
                required
              />
              <Form.Control.Feedback type="invalid">
                {supplierFormErrors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="supplierAddress">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                as="textarea"
                name="address"
                rows={3}
                value={newSupplier.address}
                onChange={handleNewSupplierChange}
                isInvalid={!!supplierFormErrors.address}
                // Add 'required' if address is mandatory
              />
              <Form.Control.Feedback type="invalid">
                {supplierFormErrors.address}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeSupplierModal}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleCreateSupplier}>
            Lưu nhà cung cấp
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddProduct;
