import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import image1 from "../../images/paint.jpg";
import { BASE_URL } from "../../Utils/config";
import Swal from "sweetalert2";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Carousel } from "react-bootstrap";

const ShopProductDetail = ({ id, onBack }) => {
  const [product, setProduct] = useState(null);
  const [skus, setSkus] = useState([]);
  const [selectedSku, setSelectedSku] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const shopId = 1;

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
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product) return;

    const params = new URLSearchParams({
      page: 1,
      size: 10,
      sortBy: "id",
      direction: "ASC",
      productId: product.id,
    });

    const fetchSKUs = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/public/productskus?${params.toString()}`
        );
        const data = await response.json();
        setSkus(data.content);
        if (data.content.length > 0) {
          setSelectedSku(data.content[0]);
        }
      } catch (error) {
        console.error("Error fetching SKUs:", error);
      }
    };

    fetchSKUs();
  }, [product]);

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

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container shadow-sm border rounded p-3">
      <div className="d-flex align-items-center mb-3">
        <span className="me-2 btn bg-gray-200" onClick={onBack}>
          <FaArrowLeftLong size={20} />
        </span>
        <h4 className="mb-0">Chi tiết sản phẩm</h4>
      </div>
      <div className="row ">
        <div className="col-md-5">
          <img
            src={selectedSku?.images || product?.images || image1}
            alt={product.name}
            className="img-fluid rounded"
            style={{ width: "350px", height: "350px", cursor: "pointer" }}
          />
          {/* Carousel hiển thị các SKU */}
          <Carousel indicators={false} interval={null} className="mt-3">
            <Carousel.Item>
              <div className="d-flex gap-2 justify-content-center">
                {skus?.map((sku) => (
                  <img
                    key={sku.id}
                    src={sku.images || image1}
                    alt={sku.skuCode}
                    className={`img-thumbnail ${
                      selectedSku?.id === sku.id
                        ? "border border-warning border-3"
                        : ""
                    }`}
                    style={{ width: "90px", height: "90px", cursor: "pointer" }}
                    onClick={() => handleSkuChange(sku)}
                  />
                ))}
              </div>
            </Carousel.Item>
          </Carousel>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="col-md-6 border-left">
          <h4 className="text-uppercase text-warning mb-8">{product.name}</h4>
          <div className="bg-light p-3">
            <span className="text-muted">Giá bán:</span>
            <strong className="text-danger m-3">
              {(selectedSku?.sellingPrice || 0).toLocaleString("vi-VN")} VNĐ
            </strong>
            <br />
          </div>
          <p className="text-muted mt-10">Phân loại: {selectedSku?.skuCode}</p>
          <h6 className="text-muted mb-10">Đơn vị: {convertUnitToVietnamese(product?.unit)} </h6>
          <h6 className="text-muted mb-10">{product?.unitAdvance} </h6>
          <div className="d-flex align-items-center mb-3">
            <span className="text-muted mr-3">Số lượng: </span>
            <button
              className="btn btn-outline-secondary"
              onClick={() => handleQuantityChange("decrease")}
            >
              -
            </button>
            <span className="mx-3">{quantity}</span>
            <button
              className="btn btn-outline-secondary"
              onClick={() => handleQuantityChange("increase")}
            >
              +
            </button>
          </div>

          <button
            className="btn btn-warning w-100 text-white fw-bold"
            onClick={handleAddCart}
          >
            <FaShoppingCart className="me-2" /> Thêm vào giỏ hàng
          </button>
        </div>
      </div>
      <div className="mt-5 mb-1 p-3 shadow-sm border rounded">
        <div className="d-flex align-items-center">
          <img
            src="https://via.placeholder.com/50"
            alt="logo"
            className="rounded-circle"
          />
          <div>
            <h6 className="m-0">Người bán: {product.supplier.name}</h6>
          </div>
        </div>
        <hr />
        <div className="d-flex justify-content-between flex-wrap">
          <div>
            <p className="m-0">Email</p>
            <strong>{product.supplier.contactEmail}</strong>
          </div>
          <div>
            <p className="m-0">Số điện thoại</p>
            <strong>{product.supplier.phone}</strong>
          </div>
          <div>
            <p className="m-0">Địa chỉ</p>
            <strong>{product.supplier.address}</strong>
          </div>
        </div>
      </div>
      <div className="mt-1 mb-10 p-3 shadow-sm border rounded">
        <h4 className="m-0 fw-bold">Mô tả sản phẩm</h4>
        <div className="d-flex justify-content-between flex-wrap">
          <span>{product.description}</span>
        </div>
      </div>
    </div>
  );
};

export default ShopProductDetail;
