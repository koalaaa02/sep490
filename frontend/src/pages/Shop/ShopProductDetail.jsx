import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import image1 from "../../images/glass.jpg";
import { BASE_URL } from "../../Utils/config";
import Swal from "sweetalert2";

const ShopProductDetail = ({ id, onBack }) => {
  const [product, setProduct] = useState(null);
  const [selectedSku, setSelectedSku] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const shopId = 1;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/public/product/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setProduct(data);
        if (data.skus.length > 0) {
          setSelectedSku(data.skus[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);
  const handleQuantityChange = (type) => {
    setQuantity((prev) => {
      if (type === "increase") return prev + 1;
      if (type === "decrease" && prev > 1) return prev - 1;
      return prev;
    });
  };

  const handleSkuChange = (sku) => {
    setSelectedSku(sku);
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  const handleAddCart = async () => {
    if (!selectedSku?.id || quantity <= 0) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Thông tin sản phẩm không hợp lệ!",
      });
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/cart/add?shopId=${shopId}&productSKUId=${selectedSku.id}&quantity=${quantity}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok)
        throw new Error("Không thể thêm sản phẩm vào giỏ hàng.");

      Swal.fire({
        icon: "success",
        title: "Thêm vào giỏ hàng",
        text: "Sản phẩm đã được thêm vào giỏ hàng!",
        showConfirmButton: true,
        timer: 2000,
      });
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.",
      });
    }
  };

  return (
    <div className="container">
      <div className="d-flex align-items-center mb-3">
        <span className="me-2 p-2 rounded btn btn-warning" onClick={onBack}>
          ←
        </span>
        <h4 className="mb-0">Chi tiết sản phẩm</h4>
      </div>
      <div className="row">
        {/* Hình ảnh sản phẩm */}
        <div className="col-md-6">
          <img
            // src={selectedSku?.images || product.images}
            src={image1}
            alt={product.name}
            className="img-fluid rounded"
            style={{ width: "400px", height: "300px", cursor: "pointer" }}
          />
          <div className="d-flex mt-3">
            {product.skus.map((sku) => (
              <img
                key={sku.id}
                // src={sku.images}
                src={image1}
                alt={sku.skuCode}
                className="img-thumbnail me-2"
                style={{ width: "100px", height: "100px", cursor: "pointer" }}
                onClick={() => handleSkuChange(sku)}
              />
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="col-md-6">
          <h2 className="text-uppercase text-warning">
            Tên sản phẩm: {product.name}
          </h2>
          <h3 className="fw-bold">Mô tả: {product.description}</h3>
          <p className="text-muted">Màu sắc: {selectedSku?.skuCode}</p>

          <h5 className="fw-bold text-dark text-decoration-line-through">
            Giá gốc: {selectedSku?.costPrice || 0} VNĐ
            <span className="badge bg-warning text-dark">0%</span>
          </h5>
          <h5 className="fw-bold text-danger">
            Giá khuyến mãi: {selectedSku?.sellingPrice || 0} VNĐ
          </h5>
          <p className="text-muted">Kho: {selectedSku?.stock || 0} PCS</p>

          <div className="d-flex align-items-center mb-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => handleQuantityChange("decrease")}
            >
              -
            </button>
            <span className="mx-5">{quantity}</span>
            <button
              className="btn btn-outline-secondary"
              onClick={() => handleQuantityChange("increase")}
            >
              +
            </button>
          </div>

          <button
            className="btn btn-warning w-100 text-white fw-bold"
            onClick={() => handleAddCart()}
          >
            <FaShoppingCart className="me-2" /> Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopProductDetail;
