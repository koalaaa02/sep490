import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../Utils/config";
import { FaEdit, FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";

const ProductDetail = ({ productId, setSelectedProductId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const token = sessionStorage.getItem("access_token");
  const [productData, setProductData] = useState(null);
  const [product, setProduct] = useState(null);
  const [productSkuData, setProductSkuData] = useState([]);
  const [editingSkuId, setEditingSkuId] = useState(null);
  const [newSku, setNewSku] = useState(null);
  const [previewImages, setPreviewImages] = useState({});
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skuErrors, setSkuErrors] = useState({});
  const [nameError, setNameError] = useState("");

  const shopId = useSelector((state) => state.shop.shopId);

  const defaultSkuData = {
    id: 0,
    skuCode: "",
    stock: 10000,
    costPrice: 0,
    listPrice: 0,
    sellingPrice: 0,
    wholesalePrice: 0,
    images: "string",
    bulky: false,
  };

  const toggleProductActive = async (productId) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn ${
          !product.stop ? "ẩn" : "kích hoạt"
        } sản phẩm này không?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/provider/products/${productId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...product,
            categoryId: product.category?.id || null,
            supplierId: product.supplier?.id || null,
            stop: !product.stop,
          }),
        }
      );
      console.log(product.supplier?.id);

      if (response.ok) {
        const updatedProduct = await response.json();
        setProduct(updatedProduct);
        alert(
          `${!updatedProduct.stop ? "Kích hoạt" : "Ẩn"} sản phẩm thành công!`
        );
      } else {
        alert("Cập nhật trạng thái sản phẩm thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: 1,
          size: 100,
          sortBy: "id",
          direction: "ASC",
        });

        const [productResponse, anotherResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/provider/products/${productId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }),
          fetch(
            `${BASE_URL}/api/provider/productskus/?${params.toString()}&productId=${productId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          ),
        ]);

        const [productData, anotherData] = await Promise.all([
          productResponse.json(),
          anotherResponse.json(),
        ]);

        setProductData(productData);
        setProductSkuData(anotherData.content);

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

        const data2 = await response2.json();
        setSuppliers(data2?.content);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchData();
  }, [productId]);

  useEffect(() => {
    if (productData) {
      setProduct({ ...productData });
    }
  }, [productData]);

  if (!product) {
    return (
      <div className="p-3 mb-10">
        <h2>Không tìm thấy sản phẩm!</h2>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "supplierId") {
      const selectedSupplier = suppliers.find(
        (supplier) => supplier.id.toString() === value
      );
      setProduct({
        ...product,
        supplier: selectedSupplier || null,
      });
    } else if (name === "categoryId") {
      const selectedCategory = categories.find(
        (category) => category.id.toString() === value
      );
      setProduct({
        ...product,
        category: selectedCategory || null,
      });
    } else {
      setProduct({
        ...product,
        [name]: value,
      });

      if (name === "name" || name === "unitAdvance") {
        if (!value || value.trim() === "" || isValidInput(value)) {
          setNameError("Giá trị truyền vào không hợp lệ.");
        } else {
          setNameError("");
        }
      }
    }
  };

  const getNextId = () => {
    if (!productSkuData || productSkuData.length === 0) {
      return 1;
    }
    const nextId = Math.max(...productSkuData.map((sku) => sku.id)) + 1;
    return nextId;
  };

  const handleSave = async () => {
    if (
      !product.name?.trim() ||
      !product.description?.trim() ||
      !product.unit?.trim() ||
      !product.category?.id ||
      !product.supplier?.id ||
      !product.specifications?.trim()
    ) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc ! (*)");
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/api/provider/products/${productId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: product.id,
            name: product.name,
            description: product.description,
            specifications: product.specifications,
            unit: product.unit.toUpperCase(),
            unitAdvance: product.unitAdvance,
            // images: product.images,
            active: product.active,
            stop: product.stop,
            categoryId: product.category?.id || 1,
            supplierId: product.supplier?.id || 1,
            shopId: shopId,
          }),
        }
      );

      console.log(product.supplier?.id);

      if (response.ok) {
        const updatedProduct = await response.json();
        setProductData(updatedProduct);
        setIsEditing(false);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        alert("Lỗi khi cập nhật sản phẩm!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleCancel = () => {
    setProduct({ ...productData });
    setIsEditing(false);
  };

  const handleSkuChange = (index, field, value) => {
    // Validate skuCode
    if (field === "skuCode") {
      if (!isValidInput(value)) {
        setSkuErrors((prev) => ({
          ...prev,
          [index]: "SKU không được trống hoặc chứa ký tự đặc biệt",
        }));
      } else {
        setSkuErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[index];
          return newErrors;
        });
      }
    }

    const updatedSkus = [...productSkuData];
    updatedSkus[index] = { ...updatedSkus[index], [field]: value };
    setProductSkuData(updatedSkus);
  };

  const handleSaveSku = async (sku) => {
    if (!isValidPrice(sku.sellingPrice)) {
      alert("Giá bán phải là số hợp lệ và không âm!");
      return;
    }
    if (!isValidPrice(sku.wholesalePrice)) {
      alert("Giá sỉ phải là số hợp lệ và không âm!");
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/api/provider/productskus/${sku.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: sku.id,
            skuCode: sku.skuCode,
            stock: 999,
            costPrice: sku.costPrice || 0,
            listPrice: sku.listPrice || 0,
            sellingPrice: sku.sellingPrice,
            wholesalePrice: sku.wholesalePrice,
            images: sku.images,
            bulky: sku.bulky || false,
            productId: product.id,
          }),
        }
      );
      setEditingSkuId(null);
      if (response.ok) {
        alert("Cập nhật thành công!");
      } else {
        alert("Lỗi khi cập nhật!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleDeleteSku = async (sku) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa phân loại sản phẩm này không?`
    );
    if (!isConfirmed) return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/provider/productskus/${sku.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setProductSkuData((prevSkus) =>
          prevSkus.filter((item) => item.id !== sku.id)
        );
        alert("Xóa thành công!");
      } else {
        alert("Lỗi khi xóa!");
      }
      setEditingSkuId(null);
    } catch (error) {
      console.error("Lỗi khi xóa!", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleAddNewSku = async () => {
    if (!newSku.skuCode || newSku.stock <= 0) {
      alert("Vui lòng nhập đầy đủ thông tin hợp lệ!");
      return;
    }

    if (!isValidPrice(newSku.sellingPrice)) {
      alert("Giá bán phải là số hợp lệ và không âm!");
      return;
    }
    if (!isValidPrice(newSku.wholesalePrice)) {
      alert("Giá sỉ phải là số hợp lệ và không âm!");
      return;
    }
    try {
      const bodyData = {
        ...defaultSkuData,
        skuCode: newSku.skuCode,
        stock: newSku.stock,
        sellingPrice: newSku.sellingPrice,
        wholesalePrice: newSku.wholesalePrice,
        productId: productId,
      };
      const response = await fetch(`${BASE_URL}/api/provider/productskus`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) throw new Error("Lỗi khi thêm SKU!");

      const addedSku = await response.json();
      setProductSkuData([...productSkuData, addedSku]);
      setNewSku(null);
    } catch (error) {
      console.error(error);
      alert("Thêm mới thất bại!");
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${BASE_URL}/api/provider/products/${productId}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert("Tải ảnh thành công!");
        setProduct({ ...product, images: data.images });
      } else {
        alert("Lỗi khi tải ảnh!");
      }
    } catch (error) {
      console.error("Lỗi tải ảnh:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleImageSkuUpload = async (event, skuId) => {
    if (!event || !event.target || !event.target.files) {
      console.error("Sự kiện không hợp lệ hoặc không có tệp tin.");
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    // Tạo URL tạm để xem trước ảnh
    const previewUrl = URL.createObjectURL(file);
    setPreviewImages((prev) => ({
      ...prev,
      [skuId]: previewUrl,
    }));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${BASE_URL}/api/provider/productskus/${skuId}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.images;
        alert("Tải ảnh thành công!");
        setProductSkuData((prevData) =>
          prevData.map((sku) =>
            sku.id === skuId ? { ...sku, images: imageUrl } : sku
          )
        );
      } else {
        alert("Lỗi khi tải ảnh!");
      }
    } catch (error) {
      console.error("Lỗi tải ảnh:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const isValidInput = (value) => {
    if (!value || value.trim() === "") return false;

    const regex = /^[a-zA-Z0-9 _-]+$/;
    return regex.test(value);
  };

  const isValidPrice = (value) => {
    if (value === undefined || value === null || value === "") return false;
    const numberValue = Number(value);
    return !isNaN(numberValue) && numberValue >= 0;
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
          <label className="form-label fw-bold">
            Hình ảnh sản phẩm: <span className="strong text-danger">(*)</span>
          </label>
          <div className="d-flex align-items-center">
            {/* Hiển thị ảnh hiện tại hoặc thông báo nếu chưa có ảnh */}
            {product.images ? (
              <img
                src={product.images}
                alt="product"
                className="me-2"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            ) : (
              <span>Không có hình ảnh</span>
            )}

            {/* Input chọn ảnh mới */}
            <input
              type="file"
              accept="image/*"
              className="form-control ms-2"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="row mb-3">
          <div className="col-md-12">
            <label className="form-label fw-bold">
              Tên sản phẩm: <span className="strong text-danger">(*)</span>
            </label>
            <input
              type="text"
              className={`form-control ${nameError ? "is-invalid" : ""}`}
              name="name"
              value={product.name || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            {nameError && <div className="invalid-feedback">{nameError}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">
              Danh mục: <span className="strong text-danger">(*)</span>
            </label>
            <select
              className="form-control"
              name="categoryId"
              onChange={handleChange}
              value={product.category.id}
              disabled={!isEditing}
            >
              <option value="" disabled>
                -- Chọn danh mục --
              </option>
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
            <label className="form-label fw-bold">
              Tên nhà phân phối: <span className="strong text-danger">(*)</span>
            </label>
            <select
              className="form-control"
              name="supplierId"
              onChange={handleChange}
              value={product?.supplier?.id}
              disabled={!isEditing}
            >
              <option value="" disabled>
                -- Chọn nhà phân phối --
              </option>
              {suppliers?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">
              Email: <span className="strong text-danger">(*)</span>
            </label>
            <input
              type="email"
              className="form-control"
              value={product.supplier?.contactEmail || ""}
              readOnly
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">
              Số điện thoại: <span className="strong text-danger">(*)</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={product.supplier?.phone || ""}
              readOnly
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">
              Đơn vị: <span className="strong text-danger">(*)</span>
            </label>
            <select
              className="form-control"
              name="unit"
              value={product.unit}
              onChange={handleChange}
              disabled={!isEditing}
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
            <label className="form-label fw-bold">
              Tính theo đơn vị (VD: 1 thùng 24 lon):{" "}
              <span className="strong text-danger">(*)</span>
            </label>
            <input
              type="text"
              className={`form-control ${nameError ? "is-invalid" : ""}`}
              name="unitAdvance"
              value={product.unitAdvance}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            {nameError && <div className="invalid-feedback">{nameError}</div>}
          </div>
        </div>

        <div className="row mb-3">
          <label className="form-label fw-bold">Danh sách phân loại:</label>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ảnh</th>
                <th>
                  Phân loại <span className="strong text-danger">(*)</span>
                </th>
                {/* <th>Số lượng tồn kho</th> */}
                <th>
                  Giá bán (VNĐ) <span className="strong text-danger">(*)</span>
                </th>
                <th>
                  Giá sỉ (VNĐ) <span className="strong text-danger">(*)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {productSkuData?.map((sku, index) => (
                <tr key={sku.id}>
                  <td>{index + 1}</td>
                  {editingSkuId === sku.id ? (
                    <td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            id={`fileInput-${sku.id}`}
                            className="form-control ms-2"
                            onChange={(event) =>
                              handleImageSkuUpload(event, sku.id)
                            }
                            style={{ display: "none" }}
                          />

                          <img
                            src={previewImages[sku.id] || sku.images}
                            alt="Preview"
                            style={{
                              width: "70px",
                              height: "70px",
                              objectFit: "cover",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              document
                                .getElementById(`fileInput-${sku.id}`)
                                .click()
                            }
                          />
                        </div>
                      </td>
                    </td>
                  ) : (
                    <td>
                      {sku.images ? (
                        <img
                          src={sku.images}
                          alt="sku"
                          className="me-2"
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                      ) : (
                        <span>Không có hình ảnh</span>
                      )}
                    </td>
                  )}

                  <td>
                    <input
                      type="text"
                      className={`form-control ${
                        skuErrors[index] ? "is-invalid" : ""
                      }`}
                      value={sku.skuCode}
                      onChange={(e) =>
                        handleSkuChange(index, "skuCode", e.target.value)
                      }
                    />
                    {skuErrors[index] && (
                      <div className="invalid-feedback">{skuErrors[index]}</div>
                    )}
                  </td>
                  {/* <td>
                    <input
                      type="number"
                      className="form-control"
                      value={sku.stock}
                      onChange={(e) =>
                        handleSkuChange(index, "stock", e.target.value)
                      }
                    />
                  </td> */}
                  <td>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={sku.sellingPrice}
                      onChange={(e) =>
                        handleSkuChange(index, "sellingPrice", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={sku.wholesalePrice}
                      onChange={(e) =>
                        handleSkuChange(index, "wholesalePrice", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    {editingSkuId === sku.id ? (
                      <>
                        <button
                          className="btn btn-success ms-1"
                          onClick={() => handleSaveSku(sku)}
                        >
                          Lưu
                        </button>
                        <button
                          className="btn btn-danger ms-1"
                          onClick={() => handleDeleteSku(sku)}
                        >
                          Xóa
                        </button>
                      </>
                    ) : (
                      <FaEdit
                        className="text-primary cursor-pointer"
                        onClick={() => setEditingSkuId(sku.id)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </td>
                </tr>
              ))}
              {newSku && (
                <tr>
                  <td>{newSku.id}</td>
                  <td>-</td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={newSku.skuCode}
                      onChange={(e) =>
                        setNewSku({ ...newSku, skuCode: e.target.value })
                      }
                    />
                  </td>
                  {/* <td>
                    <input
                      type="number"
                      className="form-control"
                      value={newSku.stock}
                      onChange={(e) =>
                        setNewSku({ ...newSku, stock: e.target.value })
                      }
                    />
                  </td> */}
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={newSku.sellingPrice}
                      onChange={(e) =>
                        setNewSku({ ...newSku, sellingPrice: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={newSku.wholesalePrice}
                      onChange={(e) =>
                        setNewSku({ ...newSku, wholesalePrice: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-success ms-1"
                      onClick={handleAddNewSku}
                    >
                      Lưu
                    </button>
                    <button
                      className="btn btn-danger ms-1"
                      onClick={() => setNewSku(null)}
                    >
                      Hủy
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {!newSku && (
            <button
              className="btn btn-primary mt-2"
              onClick={() =>
                setNewSku({
                  id: getNextId(),
                  skuCode: "",
                  stock: 9999,
                  sellingPrice: 0,
                  wholesalePrice: 0,
                })
              }
            >
              <FaPlus /> Thêm mới
            </button>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">
            Mô tả sản phẩm: <span className="strong text-danger">(*)</span>
          </label>
          <textarea
            className="form-control"
            name="description"
            rows="3"
            value={product.description || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            style={{ height: "120px" }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">
            Thông số kỹ thuật: <span className="strong text-danger">(*)</span>
          </label>
          <textarea
            className="form-control"
            name="specifications"
            rows="3"
            value={product.specifications || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            style={{ height: "120px" }}
          />
        </div>
        {!isEditing ? (
          <>
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </button>
            {!product?.stop ? (
              <button
                className="btn btn-danger ms-2"
                onClick={() => toggleProductActive(product.id)}
              >
                Ẩn Sản Phẩm
              </button>
            ) : (
              <button
                className="btn btn-success ms-2"
                onClick={() => toggleProductActive(product.id)}
              >
                Kích hoạt Sản Phẩm
              </button>
            )}
          </>
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
