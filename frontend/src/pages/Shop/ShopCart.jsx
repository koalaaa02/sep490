import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { BASE_URL } from "../../Utils/config";
import { FaTrashAlt } from "react-icons/fa";
import img1 from "../../images/glass.jpg";

const ShopCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const isLoggedIn = !!localStorage.getItem("user");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/cart`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error(`Lỗi: ${response.status}`);

        const data = await response.json();
        setCartItems(data.shops || []);
      } catch (error) {
        console.error("Lỗi khi fetch API:", error);
      }
      setLoaderStatus(false);
    };

    fetchData();
  }, []);

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

  const removeFromCart = async (shopId, productSKUId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/cart/remove?shopId=${shopId}&productSKUId=${productSKUId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to remove item from cart");

      setCartItems((prevCartItems) =>
        prevCartItems
          .map((shop) => ({
            ...shop,
            items: shop.items.filter(
              (item) => item.productSKUId !== productSKUId
            ),
          }))
          .filter((shop) => shop.items.length > 0)
      );
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, shop) => {
        return (
          total +
          shop.items.reduce((shopTotal, item) => {
            if (selectedItems[item.productSKUId]) {
              return (
                shopTotal +
                item.quantity * item.productSKUResponse?.sellingPrice
              );
            }
            return shopTotal;
          }, 0)
        );
      }, 0)
      .toLocaleString("vi-VN");
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate("/MyAccountSignIn");
    } else {
      const selectedShops = cartItems
        .map((shop) => {
          const selectedProducts = shop.items.filter(
            (item) => selectedItems?.[item.productSKUId]
          );
          return selectedProducts.length > 0
            ? { ...shop, items: selectedProducts }
            : null;
        })
        .filter(Boolean);

      if (selectedShops.length === 0) {
        alert("Vui lòng chọn ít nhất một sản phẩm để đặt hàng!");
        return;
      }

      navigate("/ShopCheckout", { state: { selectedShops } });
    }
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const updatedSelection = {};
    cartItems.forEach((shop) => {
      shop.items.forEach((item) => {
        updatedSelection[item.productSKUId] = newSelectAll;
      });
    });
    setSelectedItems(updatedSelection);
  };

  const toggleItemSelection = (productSKUId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [productSKUId]: !prev[productSKUId],
    }));
  };

  const updateQuantity = async (shopId, productSKUId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/cart/update?shopId=${shopId}&productSKUId=${productSKUId}&quantity=${newQuantity}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Lỗi khi cập nhật số lượng");

      setCartItems((prevCartItems) =>
        prevCartItems.map((shop) => ({
          ...shop,
          items: shop.items.map((item) =>
            item.productSKUId === productSKUId
              ? { ...item, quantity: newQuantity }
              : item
          ),
        }))
      );
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
    }
  };

  return (
    <div>
      {loaderStatus ? (
        <div className="loader-container">
          <MagnifyingGlass
            visible={true}
            height="100"
            width="100"
            color="#0aad0a"
          />
        </div>
      ) : (
        <>
          <ScrollToTop />
          <section className="mb-8 mt-8">
            <div className="container mt-4">
              <h4>Giỏ hàng</h4>
              {cartItems.length > 0 ? (
                <>
                  {/* Header Table */}
                  <div className="card p-3 mb-2 d-flex flex-row align-items-center">
                    <h5 className="mb-0 col-4 text-center">Sản Phẩm</h5>
                    <h5 className="mb-0 col-2 text-center">Đơn giá</h5>
                    <h5 className="mb-0 col-1 text-center">Đơn vị</h5>
                    <h5 className="mb-0 col-2 text-center">Số lượng</h5>
                    <h5 className="mb-0 col-2 text-center">Số tiền</h5>
                    <h5 className="mb-0 col-1 text-center">Thao tác</h5>
                  </div>

                  {/* Danh sách sản phẩm */}
                  <div className="card p-3">
                    {cartItems.map((shop) => (
                      <div key={shop.shopId}>
                        {/* Tên cửa hàng */}
                        <div className="d-flex align-items-center mb-3 border-bottom pb-3">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={toggleSelectAll}
                            className="me-2"
                          />
                          <strong>Tên cửa hàng: {shop.shopName}</strong>
                        </div>

                        {/* Sản phẩm trong cửa hàng */}
                        {shop.items.map((item) => (
                          <div
                            key={item.productSKUId}
                            className="row border-bottom container"
                          >
                            <div
                              className={`row align-items-center m-2 p-2 border border-1 rounded-1 ${
                                selectedItems[item.productSKUId]
                                  ? "bg-light"
                                  : ""
                              }`}
                            >
                              {/* Checkbox */}
                              <div className="col-1 text-center">
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedItems[item.productSKUId] || false
                                  }
                                  onChange={() =>
                                    toggleItemSelection(item.productSKUId)
                                  }
                                />
                              </div>

                              {/* Ảnh sản phẩm */}
                              <div className="col-1 text-center">
                                <img
                                  src={item.imageUrl || img1}
                                  alt={item.productName}
                                  className="img-fluid mt-2"
                                  style={{
                                    height: "70px",
                                    width: "70px",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    padding: "2px",
                                  }}
                                />
                              </div>

                              {/* Tên sản phẩm */}
                              <div className="col-2">
                                <h6>{item.productName}</h6>
                                <p className="text-muted">
                                  {
                                    item.productSKUResponse?.product
                                      ?.unitAdvance
                                  }
                                </p>
                                <p className="text-muted">
                                  Phân loại: {item.productSKUCode}
                                </p>
                              </div>

                              {/* Đơn giá */}
                              <div className="col-2 text-center">
                                <strong className="text-muted">
                                  {item.productSKUResponse?.sellingPrice.toLocaleString(
                                    "vi-VN"
                                  )}
                                  đ
                                </strong>
                              </div>
                              
                              {/* Đơn vị */}
                              <div className="col-1 text-center">
                                <strong className="text-muted">
                                  {convertUnitToVietnamese(
                                    item.productSKUResponse?.product?.unit
                                  )}
                                </strong>
                              </div>

                              {/* Số lượng */}
                              <div className="col-2 text-center">
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() =>
                                    updateQuantity(
                                      shop.shopId,
                                      item.productSKUId,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </button>
                                <span className="mx-2">{item.quantity}</span>
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() =>
                                    updateQuantity(
                                      shop.shopId,
                                      item.productSKUId,
                                      item.quantity + 1
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>

                              {/* Số tiền */}
                              <div className="col-2 text-center">
                                <strong className="text-danger">
                                  {(
                                    item.quantity *
                                    item.productSKUResponse?.sellingPrice
                                  ).toLocaleString("vi-VN")}
                                  đ
                                </strong>
                              </div>

                              {/* Nút xóa */}
                              <div className="col-1 text-center">
                                <button
                                  onClick={() =>
                                    removeFromCart(
                                      shop.shopId,
                                      item.productSKUId
                                    )
                                  }
                                  className="btn btn-link text-warning"
                                >
                                  <FaTrashAlt />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}

                    {/* Tổng thanh toán */}
                    <div className="d-flex justify-content-between align-items-center border-top pt-3">
                      <h6 className="m-0">
                        Tổng thanh toán:{" "}
                        <strong className="text-warning">
                          {calculateTotal()}đ
                        </strong>
                      </h6>
                      <button
                        onClick={handleCheckout}
                        className="btn btn-warning btn-lg"
                      >
                        Đặt hàng
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <span>Bạn chưa có sản phẩm nào trong giỏ hàng</span>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ShopCart;
