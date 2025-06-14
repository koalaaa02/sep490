import React, { useEffect, useState } from "react";
import Grocerylogo from "../images/Logo.png";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../Utils/config";
import img from "../images/glass.jpg";
import { FaStore } from "react-icons/fa";
import { setShopId } from "../Redux/shop.js";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  const name = useSelector((state) => state.auth.user?.firstName);
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.user?.roles || []);
  const normalizedRoles = typeof role === "string" ? role.split(",") : [];

  const isProvider = normalizedRoles.includes("ROLE_PROVIDER");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/");
    window.location.reload();
  };

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
  }, []);

  useEffect(() => {
    const fetchMyShop = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/provider/shops/myshop`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Không thể lấy thông tin shop");
        }

        const data = await response.json();
        dispatch(setShopId(data.id));
      } catch (error) {
        console.error("Lỗi khi lấy thông tin shop:", error);
      }
    };

    if (isProvider && token) {
      fetchMyShop();
    }
  }, [isProvider, token, dispatch]);

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
            (shopTotal, item) => shopTotal + 100 * item.quantity,
            0
          )
        );
      }, 0)
      .toFixed(3);
  };

  return (
    <div>
      <>
        <div className="container  displaydesign"></div>
      </>
      <nav className="navbar navbar-expand-lg navbar-light sticky-top">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img
              src={Grocerylogo}
              style={{ width: 100, marginBottom: 10, marginLeft: "-15px" }}
              alt="eCommerce HTML Template"
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile_nav"
            aria-controls="mobile_nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <div
              className={`containerr ${isOpen ? "change" : ""}`}
              onClick={handleClick}
            >
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
          </button>

          <div className="collapse navbar-collapse" id="mobile_nav">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0 float-md-right"></ul>
            <ul className="navbar-nav navbar-light">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Trang chủ
                </Link>
              </li>

              <li className="nav-item dmenu dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Sản phẩm
                </Link>
                <div
                  className="dropdown-menu sm-menu"
                  aria-labelledby="navbarDropdown"
                >
                  <Link className="dropdown-item" to="/ShopWishList">
                    Danh sách yêu thích
                  </Link>
                  <Link className="dropdown-item" to="/ShopCart">
                    Giỏ hàng
                  </Link>
                  <Link className="dropdown-item" to="/ShopCheckOut"></Link>
                </div>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/StoreList">
                  Danh sách Nhà cung cấp
                </Link>
              </li>

              <li className="nav-item dmenu dropdown">
                {/* <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Thông tin
                </Link> */}
                <div
                  className="dropdown-menu sm-menu"
                  aria-labelledby="navbarDropdown"
                >
                  <Link class="dropdown-item" to="/Blog">
                    Bài viết
                  </Link>
                  <Link className="dropdown-item" to="/BlogCategory">
                    Bài viết danh mục
                  </Link>
                  <Link className="dropdown-item" to="/AboutUs">
                    Thông tin về chúng tôi
                  </Link>
                  <Link className="dropdown-item" to="/Contact">
                    Liên hệ
                  </Link>
                </div>
              </li>
              <li className="nav-item dmenu dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to=""
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Tài khoản
                </Link>
                <div
                  className="dropdown-menu sm-menu"
                  aria-labelledby="navbarDropdown"
                >
                  <div>
                    <div>
                      {token ? (
                        <>
                          <div className="dropdown-item disabled text-dark">
                            Xin chào {name}
                          </div>
                          <Link className="dropdown-item" to="/MyAccountOrder">
                            Đơn hàng
                          </Link>
                          <Link
                            className="dropdown-item"
                            to="/MyAccountSetting"
                          >
                            Cài đặt
                          </Link>
                          <Link
                            className="dropdown-item"
                            to="/MyAccountAddress"
                          >
                            Địa chỉ
                          </Link>
                          {/* <Link
                            className="dropdown-item"
                            to="/MyAcconutInvoice"
                          >
                            Hóa đơn của tôi
                          </Link> */}
                          <Link className="dropdown-item" to="/MyDebt">
                            Khoản nợ
                          </Link>
                          <button
                            className="dropdown-item"
                            onClick={handleLogOut}
                          >
                            Đăng xuất
                          </button>
                        </>
                      ) : (
                        <>
                          <Link className="dropdown-item" to="/MyAccountSignIn">
                            Đăng nhập
                          </Link>
                          <Link className="dropdown-item" to="/MyAccountSignUp">
                            Đăng ký
                          </Link>
                          <Link
                            className="dropdown-item"
                            to="/MyAccountForgetPassword"
                          >
                            Quên mật khẩu
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>
              {token && !isProvider && (
                <li className="nav-item">
                  <Link
                    className="nav-link text-danger"
                    to="/MyAcconutPaymentMethod"
                  >
                    Đăng ký bán hàng
                  </Link>
                </li>
              )}

              <li className="nav-item dmenu dropdown">
                {/* <Link
                  className="text-muted position-relative"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasRight"
                  to="#offcanvasExample"
                  role="button"
                  aria-controls="offcanvasRight"
                >
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-shopping-bag mt-2"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1={3} y1={6} x2={21} y2={6} />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                    {cartItems.reduce(
                      (total, shop) => total + shop.items.length,
                      0
                    )}
                  </span>
                </Link> */}
                {isProvider && (
                  <Link
                    to="/ProviderDashBoard"
                    className="nav-link text-danger"
                  >
                    {/* <FaStore size={20} className="mt-2 ms-3" /> */}
                    Cửa hàng của tôi
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <>
        <div>
          {/* Shop Cart */}
          <div
            className="offcanvas offcanvas-end"
            tabIndex={-1}
            id="offcanvasRight"
            aria-labelledby="offcanvasRightLabel"
          >
            <div className="offcanvas-header border-bottom">
              <h5 id="offcanvasRightLabel" className="mb-0 fs-4">
                Giỏ hàng
              </h5>
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
            {cartItems.length === 0 ? (
              <div className="offcanvas-body">
                <div className="alert alert-info" role="alert">
                  Bạn chưa có đơn hàng. Bắt đầu mua sắm ngay bây giờ!
                </div>
              </div>
            ) : (
              <div className="offcanvas-body">
                {cartItems.map((shop) => (
                  <div key={shop.shopId} className="mb-3">
                    <h6 className="fw-bold">{shop.shopName}</h6>
                    <ul className="list-group list-group-flush">
                      {shop.items.map((item) => (
                        <li
                          key={item.productSKUId}
                          className="list-group-item py-3 px-0 border-top"
                        >
                          <div className="row align-items-center">
                            <div className="col-2">
                              <img
                                src={img}
                                alt={item.productName}
                                className="img-fluid"
                              />
                            </div>
                            <div className="col-4">
                              <h6 className="mb-0">{item.productName}</h6>
                              <span className="text-muted">
                                Phân loại: {item.productSKUCode}
                              </span>
                              <div className="mt-2 small">
                                <button
                                  onClick={() =>
                                    removeFromCart(
                                      shop.shopId,
                                      item.productSKUId
                                    )
                                  }
                                  className="btn btn-sm btn-outline-danger"
                                >
                                  Xóa
                                </button>
                              </div>
                            </div>
                            <div className="col-3">
                              <div className="input-group flex-nowrap justify-content-center">
                                <button className="button-minus form-control text-center">
                                  -
                                </button>
                                <input
                                  type="number"
                                  step={1}
                                  defaultValue={item.quantity}
                                  className="quantity-field form-control text-center"
                                />
                                <button className="button-plus form-control text-center">
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="col-3 text-end">
                              <span className="fw-bold">
                                {(item.quantity * 100).toFixed(3)} VNĐ
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="d-grid mt-1">
                  <Link
                    className="btn btn-warning btn-lg d-flex justify-content-between align-items-center"
                    to="/ShopCart"
                  >
                    Thanh toán
                    <span className="fw-bold">{calculateTotal()} VNĐ</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    </div>
  );
};

export default Header;
