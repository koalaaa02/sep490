import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../Utils/config";

const ProductDetail = ({ productId, setSelectedProductId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem("access_token");
  const [productData, setProductData] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/provider/products/${productId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const result = await response.json();
        setProductData(result);
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

  console.log(productData);

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
            unit: product.unit,
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
    const updatedSkus = [...product.skus];
    updatedSkus[index] = { ...updatedSkus[index], [field]: value };
    setProduct({ ...product, skus: updatedSkus });
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
            stock: sku.stock,
            costPrice: sku.costPrice || 0,
            listPrice: sku.listPrice || 0,
            sellingPrice: sku.sellingPrice,
            wholesalePrice: sku.wholesalePrice,
            images: sku.images || "",
            bulky: sku.bulky || false,
            productId: product.id,
          }),
        }
      );

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
        alert("Xóa SKU thành công!");
      } else {
        alert("Lỗi khi xóa SKU!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa SKU:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleAddSku = async () => {
    const newSku = {
      id: 0,
      skuCode: `SKU-${Date.now()}`,
      stock: 10000,
      costPrice: 0,
      listPrice: 0,
      sellingPrice: 0,
      wholesalePrice: 0,
      images: "string",
      bulky: false,
      productId: product.id,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/provider/productskus`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSku),
      });

      if (response.ok) {
        setProduct((prevProduct) => ({
          ...prevProduct,
          skus: [...prevProduct.skus, response.data],
        }));
      }
    } catch (error) {
      console.error("Lỗi khi thêm SKU:", error);
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
          <div className="d-flex">
            {product.images ? (
              <img
                src={product.images}
                alt="product"
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
        </div>

        {/* Hình ảnh danh mục */}
        <div className="mb-3">
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
        </div>

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
        </div>

        <div className="row mb-3">
          <label className="form-label fw-bold">Danh sách SKU:</label>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mã SKU</th>
                <th>Số lượng tồn kho</th>
                <th>Giá bán (VNĐ)</th>
                <th>Giá sỉ (VNĐ)</th>
              </tr>
            </thead>
            <tbody>
              {product.skus?.map((sku, index) => (
                <tr key={sku.id}>
                  <td>{sku.id}</td>
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
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={sku.stock}
                      onChange={(e) =>
                        handleSkuChange(index, "stock", e.target.value)
                      }
                    />
                  </td>
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
                    <button
                      className="btn btn-success"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
