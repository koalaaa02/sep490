import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { BASE_URL } from "../../Utils/config";
import img1 from "../../images/glass.jpg";

const ShopCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loaderStatus, setLoaderStatus] = useState(true);
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
    };

    fetchData();

    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

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
      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

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
          shop.items.reduce(
            (shopTotal, item) => shopTotal + 100000 * item.quantity,
            0
          )
        );
      }, 0)
      .toFixed(3);
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate("/MyAccountSignIn");
    } else {
      navigate("/ShopCheckout");
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
            ariaLabel="magnifying-glass-loading"
            glassColor="#c0efff"
            color="#0aad0a"
          />
        </div>
      ) : (
        <>
          <ScrollToTop />
          <section className="mb-lg-14 mb-8 mt-8">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="card py-1 border-0 mb-8">
                    <h1 className="fw-bold">Giỏ hàng</h1>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="py-3">
                  {cartItems.length === 0 ? (
                    <p>Giỏ hàng của bạn đang trống.</p>
                  ) : (
                    <div className="row">
                      <div className="col-lg-8 col-md-8">
                        <div className="row">
                          {cartItems.map((shop) => (
                            <div key={shop.shopId} className="mb-4">
                              <h5 className="fw-bold mb-3">
                                Tên cửa hàng: {shop.shopName}
                              </h5>
                              <ul className="list-group">
                                {shop.items.map((item) => (
                                  <li
                                    key={item.productSKUId}
                                    className="list-group-item d-flex align-items-center justify-content-between"
                                  >
                                    <div className="d-flex align-items-center">
                                      <img
                                        src={img1}
                                        alt={item.productName}
                                        className="img-fluid me-3"
                                        style={{
                                          width: "100px",
                                          height: "120px",
                                        }}
                                      />
                                      <div>
                                        <h6 className="mb-1">
                                          {item.productName}
                                        </h6>
                                        <span>
                                          Số lượng: {item.quantity}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-end">
                                      <span className="fw-bold text-danger d-block">
                                        {(100 * item.quantity).toFixed(3)} VNĐ
                                      </span>
                                      <button
                                        className="btn btn-sm btn-danger mt-2"
                                        onClick={() =>
                                          removeFromCart(
                                            shop.shopId,
                                            item.productSKUId
                                          )
                                        }
                                      >
                                        <i className="fas fa-trash"></i>
                                      </button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-4">
                        <div className="card mt-6">
                          <div className="card-body">
                            <h2 className="h5 mb-4">Tổng tiền</h2>
                            <ul className="list-group list-group-flush">
                              <li className="list-group-item d-flex justify-content-between">
                                <div>Tổng sản phẩm:</div>
                                <span>
                                  {Number(calculateTotal()).toLocaleString(
                                    "vi-VN"
                                  )}{" "}
                                  VNĐ
                                </span>
                              </li>
                              <li className="list-group-item d-flex justify-content-between">
                                <div>Phí giao hàng:</div>
                                <span>10.000 VNĐ</span>
                              </li>
                              <li className="list-group-item d-flex justify-content-between fw-bold">
                                <div>Tổng cộng:</div>
                                <span>
                                  {(
                                    Number(calculateTotal()) + 10000
                                  ).toLocaleString("vi-VN")}{" "}
                                  VNĐ
                                </span>
                              </li>
                            </ul>
                            <div
                              className="d-grid mt-4"
                              onClick={handleCheckout}
                            >
                              <Link className="btn btn-warning fw-bold">
                                Thanh toán ngay
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="d-flex justify-content-between mt-4">
                <Link to="/" className="btn btn-warning">
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ShopCart;
