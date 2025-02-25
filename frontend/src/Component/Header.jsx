import React, { useState } from "react";
import Grocerylogo from "../images/Logo.png";
import productimage1 from "../images/cement.jpg";
import productimage2 from "../images/tiles.png";
import productimage3 from "../images/sand.jpg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Redux/slice/authSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  const role = useSelector((state) => state.auth.roles);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/");
    window.location.reload();
  };

  const cartItems = [
    {
      id: 1,
      name: "Xi măng",
      image: productimage1,
      price: "350.000",
      unit: "10 bao",
    },
    {
      id: 2,
      name: "Đá ốp",
      image: productimage2,
      price: "250.000",
      oldPrice: "350.000",
      unit: "10 viên",
    },
    {
      id: 3,
      name: "Cát",
      image: productimage3,
      price: "250.000",
      unit: "20 bao",
    },
  ];

  return (
    <div>
      <>
        <div className="container  displaydesign">
          <div className="row g-4">
            <div className="col-8 col-sm-4 col-lg-9 py-2">
              <input
                className="form-control "
                style={{ width: "100%" }}
                list="datalistOptions"
                id="exampleDataList"
                placeholder="Type to search..."
              />
            </div>
          </div>
        </div>
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
          <input
            className="form-control responsivesearch "
            list="datalistOptions"
            id="exampleDataList"
            placeholder="Type to search..."
            fdprocessedid="9icrif"
            style={{ width: "35%" }}
          />

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
              <li className="nav-item">
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
                    Tất cả danh mục
                  </Link>
                  <div
                    className="dropdown-menu sm-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <Link className="dropdown-item" to="/Shop">
                      Cement
                    </Link>
                    <Link className="dropdown-item" to="/Shop">
                      Bricks
                    </Link>
                    <Link className="dropdown-item" to="/Shop">
                      Sand
                    </Link>
                    <Link className="dropdown-item" to="/Shop">
                      Steel
                    </Link>
                    <Link className="dropdown-item" to="/Shop">
                      Tiles
                    </Link>
                    <Link className="dropdown-item" to="/Shop">
                      Wood
                    </Link>
                    <Link className="dropdown-item" to="/Shop">
                      Glass
                    </Link>
                    <Link className="dropdown-item" to="/Shop">
                      Paint
                    </Link>
                    <Link className="dropdown-item" to="/Shop">
                      Plumbing
                    </Link>
                    <Link className="dropdown-item" to="/Shop">
                      Electrical
                    </Link>
                    <Link className="dropdown-item" to="/Shop">
                      Roofing
                    </Link>
                    <Link className="dropdown-item" to="/Shop">
                      Insulation
                    </Link>
                  </div>
                </li>
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
                  Thông tin
                </Link>
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
                  <Link className="dropdown-item" to="/ShopCheckOut">
                    
                  </Link>
                </div>
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
                  Cửa hàng
                </Link>
                <div
                  className="dropdown-menu sm-menu"
                  aria-labelledby="navbarDropdown"
                >
                  <Link className="dropdown-item" to="/StoreList">
                    Danh sách cửa hàng
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
                      {role ? (
                        <>
                          <div className="dropdown-item disabled text-dark">
                            Xin chào{" "}
                            {role === "ROLE_DEALER"
                              ? "Dealer"
                              : role === "ROLE_SELLER"
                              ? "Seller"
                              : "User"}
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
                          <Link
                            className="dropdown-item"
                            to="/MyAcconutPaymentMethod"
                          >
                            Phương thức thanh toán
                          </Link>
                          <Link
                            className="dropdown-item"
                            to="/MyAcconutNotification"
                          >
                            Thông báo
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
              <li className="nav-item dmenu dropdown ml-3">
                <Link
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
                    {cartItems.length}
                  </span>
                </Link>
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
            <div className="offcanvas-body">
              <div className="alert alert-danger" role="alert">
                Bạn đã có giao hàng miễn phí. Bắt đầu kiểm tra ngay bây giờ!
              </div>
              <ul className="list-group list-group-flush">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item py-3 px-0 border-top"
                  >
                    <div className="row align-items-center">
                      <div className="col-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid"
                        />
                      </div>
                      <div className="col-4">
                        <h6 className="mb-0">{item.name}</h6>
                        <small className="text-muted">{item.unit}</small>
                        <div className="mt-2 small">
                          <Link to="#!" className="text-decoration-none">
                            <span className="me-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-trash-2"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1={10} y1={11} x2={10} y2={17} />
                                <line x1={14} y1={11} x2={14} y2={17} />
                              </svg>
                            </span>
                            Remove
                          </Link>
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
                            max={10}
                            defaultValue={1}
                            className="quantity-field form-control text-center"
                          />
                          <button className="button-plus form-control text-center">
                            +
                          </button>
                        </div>
                      </div>
                      <div className="col-3 text-end">
                        <span className="fw-bold">{item.price} VNĐ</span>
                        {item.oldPrice && (
                          <span className="text-decoration-line-through text-muted small">
                            {" "}
                            {item.oldPrice}VNĐ
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="d-grid mt-1">
                <button
                  className="btn btn-warning btn-lg d-flex justify-content-between align-items-center"
                  type="submit"
                >
                  {" "}
                  Thanh toán <span className="fw-bold">1.200.000 VNĐ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Header;
