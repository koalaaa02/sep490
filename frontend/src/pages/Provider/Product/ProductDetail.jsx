import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../Utils/config";
import { FaEdit, FaPlus } from "react-icons/fa";

const ProductDetail = ({ productId, setSelectedProductId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem("access_token");
  const [productData, setProductData] = useState(null);
  const [product, setProduct] = useState(null);
  const [productSkuData, setProductSkuData] = useState([]);
  const [editingSkuId, setEditingSkuId] = useState(null);
  const [newSku, setNewSku] = useState(null);
  const [previewImages, setPreviewImages] = useState({});

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

  const deleteProduct = async (productId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/api/provider/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        alert("Xóa sản phẩm thành công!");
        setSelectedProductId(null);
      } else {
        alert("Xóa sản phẩm thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
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
    const fetchData = async () => {
      try {
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
            `${BASE_URL}/api/provider/productskus/?page=1&size=10&sortBy=id&direction=ASC&productId=${productId}`,
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
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const getNextId = () => {
    if (!productSkuData || productSkuData.length === 0) {
      return 1;
    }
    const nextId = Math.max(...productSkuData.map((sku) => sku.id)) + 1;
    return nextId;
  };

  const handleSave = async () => {
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
            // images: product.images,
            active: product.active,
            categoryId: 1,
            supplierId: 1,
            shopId: 1,
          }),
        }
      );

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
    const updatedSkus = [...productSkuData];
    updatedSkus[index] = { ...updatedSkus[index], [field]: value };
    setProductSkuData(updatedSkus);
  };

  const handleSaveSku = async (sku) => {
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
        alert("Cập nhật SKU thành công!");
      } else {
        alert("Lỗi khi cập nhật SKU!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật SKU:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleDeleteSku = async (sku) => {
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
        alert("Xóa SKU thành công!");
      } else {
        alert("Lỗi khi xóa SKU!");
      }
      setEditingSkuId(null);
    } catch (error) {
      console.error("Lỗi khi xóa SKU:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleAddNewSku = async () => {
    if (!newSku.skuCode || newSku.stock <= 0) {
      alert("Vui lòng nhập đầy đủ thông tin SKU hợp lệ!");
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
      alert("Thêm SKU thất bại!");
    }
    setProductSkuData([...productSkuData, newSku]);
    setNewSku(null);
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
        alert("Tải ảnh SKU thành công!");
        setProductSkuData((prevData) =>
          prevData.map((sku) =>
            sku.id === skuId ? { ...sku, images: imageUrl } : sku
          )
        );
      } else {
        alert("Lỗi khi tải ảnh SKU!");
      }
    } catch (error) {
      console.error("Lỗi tải ảnh SKU:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
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

        {/* Hình ảnh danh mục */}
        {/* <div className="mb-3">
          <label className="form-label fw-bold">Hình ảnh danh mục:</label>
          <div className="d-flex">
            {product.category?.images ? (
              <img
                src={product.category.images}
                alt="category"
                className="me-2"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            ) : (
              <span>Không có hình ảnh</span>
            )}
          </div>
        </div> */}

        {/* Thông tin sản phẩm */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Tên sản phẩm:</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={product.name || ""}
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
              value={product.category?.name || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Đơn vị:</label>
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
        </div>

        <div className="row mb-3">
          <label className="form-label fw-bold">Danh sách SKU:</label>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ảnh</th>
                <th>Mã SKU</th>
                {/* <th>Số lượng tồn kho</th> */}
                <th>Giá bán (VNĐ)</th>
                <th>Giá sỉ (VNĐ)</th>
              </tr>
            </thead>
            <tbody>
              {productSkuData?.map((sku, index) => (
                <tr key={sku.id}>
                  <td>{sku.id}</td>
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
                      className="form-control"
                      value={sku.skuCode}
                      onChange={(e) =>
                        handleSkuChange(index, "skuCode", e.target.value)
                      }
                    />
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
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={newSku.stock}
                      onChange={(e) =>
                        setNewSku({ ...newSku, stock: e.target.value })
                      }
                    />
                  </td>
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
                  stock: 0,
                  sellingPrice: 0,
                  wholesalePrice: 0,
                })
              }
            >
              <FaPlus /> Thêm SKU mới
            </button>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Mô tả sản phẩm:</label>
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
          <label className="form-label fw-bold">Thông số kỹ thuật: </label>
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

        {/* Nhà cung cấp */}
        <div className="mb-3">
          <label className="form-label fw-bold">Nhà cung cấp:</label>
          <input
            type="text"
            className="form-control"
            value={product.supplier?.name || "Không có thông tin"}
            readOnly
          />
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Email:</label>
            <input
              type="email"
              className="form-control"
              value={product.supplier?.contactEmail || ""}
              readOnly
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Số điện thoại:</label>
            <input
              type="text"
              className="form-control"
              value={product.supplier?.phone || ""}
              readOnly
            />
          </div>
        </div>

        {/* Nút Chỉnh sửa, Lưu, Hủy */}
        {!isEditing ? (
          <>
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </button>
            <button
              className="btn btn-danger ms-2"
              onClick={() => deleteProduct(product.id)}
            >
              Ẩn Sản Phẩm
            </button>
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
