import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { BASE_URL } from "../../Utils/config";

const ShopCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loaderStatus, setLoaderStatus] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/cart`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error(`Lỗi: ${response.status}`);
      } catch (error) {
        console.error("Lỗi khi fetch API:", error);
      }
    };

    fetchData();

    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  const removeFromCart = async () => {
    const shopId = 1;
    const productSKUId = 1;
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
    } catch (error) {
      console.error("Error removing item from cart:", error);
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
                <div className="col-lg-8 col-md-7">
                  <div className="py-3">
                    {cartItems.length === 0 ? (
                      <>
                        <p>Giỏ hàng của bạn đang trống.</p>
                      </>
                    ) : (
                      <ul className="list-group list-group-flush">
                        {cartItems?.map((item) => (
                          <li key={item.id} className="list-group-item py-3">
                            <div className="row align-items-center">
                              <div className="col-3 col-md-2">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="img-fluid"
                                />
                              </div>
                              <div className="col-4 col-md-6">
                                <h6 className="mb-0">
                                  Tên sản phẩm: {item.name}
                                </h6>
                                <span className="text-muted">
                                  Số lượng: {item.quantity}
                                </span>
                                <div className="mt-2 small">
                                  <button
                                    className="btn btn-danger btn-sm"
                                    // onClick={() => removeFromCart(item.items.productSKUId)}
                                    onClick={() => removeFromCart()}
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </div>
                              <div className="col-2 text-end">
                                <span className="fw-bold">
                                  {(100 * item.quantity).toFixed(3)} VNĐ
                                </span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="d-flex justify-content-between mt-4">
                      <Link to="/" className="btn btn-warning">
                        Tiếp tục mua sắm
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-md-5">
                  <div className="card mt-6">
                    <div className="card-body">
                      <h2 className="h5 mb-4">Tổng tiền</h2>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between">
                          <div>Tổng cộng</div>
                          <span>
                            {cartItems
                              .reduce(
                                (total, item) => total + 100 * item.quantity,
                                0
                              )
                              .toFixed(3)}{" "}
                            VNĐ
                          </span>
                        </li>
                      </ul>
                      <div className="d-grid mt-4">
                        <Link to="/checkout" className="btn btn-warning">
                          Thanh toán ngay
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ShopCart;
