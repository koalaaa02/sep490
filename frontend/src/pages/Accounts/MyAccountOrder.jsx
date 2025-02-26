import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import cement from "../../images/cement.jpg";
import bricks from "../../images/bricks.jpg";
import sand from "../../images/sand.jpg";
import steel from "../../images/steel.jpg";
import tiles from "../../images/tiles.png";
import wood from "../../images/wood.jpg";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const MyAccountOrder = () => {
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const orders = [
    {
      id: "1",
      name: "Xây nhà",
      date: "March 5, 2025",
      status: "Processing",
      badgeClass: "bg-warning",
      products: [
        {
          id: 1,
          name: "Xi măng",
          quantity: 10,
          price: 90000,
          src: cement,
          alt: "cement",
        },
        {
          id: 2,
          name: "Cát",
          quantity: 10,
          price: 15000,
          src: sand,
          alt: "sand",
        },
        {
          id: 3,
          name: "Gạch",
          quantity: 10,
          price: 15000,
          src: bricks,
          alt: "bricks",
        },
      ],
      price: 10 * 90000 + 10 * 15000 + 10 * 15000,
    },
    {
      id: "2",
      name: "Làm sân",
      date: "March 5, 2025",
      status: "Processing",
      badgeClass: "bg-warning",
      products: [
        {
          id: 1,
          name: "Thép",
          quantity: 10,
          price: 90000,
          src: steel,
          alt: "steel",
        },
        {
          id: 2,
          name: "gạch ốp",
          quantity: 10,
          price: 15000,
          src: tiles,
          alt: "tiles",
        },
        {
          id: 3,
          name: "gỗ",
          quantity: 10,
          price: 15000,
          src: wood,
          alt: "wood",
        },
      ],
      price: 10 * 90000 + 10 * 15000,
    },
  ];

  return (
    <div>
      <>
        <ScrollToTop />
      </>
      <>
        {/* section */}
        <section>
          <div className="container">
            {/* row */}
            <div className="row">
              {/* col */}
              <div className="col-12">
                <div className="mt-10 d-flex justify-content-between align-items-center d-md-none">
                  {/* heading */}
                  <h3 className="fs-5 mb-0">Account Setting</h3>               
                </div>
              </div>
              {/* col */}
              <div className="col-lg-3 col-md-4 col-12 border-end  d-none d-md-block">
                <div className="pt-10 pe-lg-10">
                  {/* nav */}
                  <ul className="nav flex-column nav-pills nav-pills-dark">
                    {/* nav item */}
                    <li className="nav-item">
                      <Link
                        className="nav-link active"
                        aria-current="page"
                        to="/MyAccountOrder"
                      >
                        <i className="fas fa-shopping-bag me-2" />
                        Đơn đặt hàng của bạn
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/MyAccountSetting">
                        <i className="fas fa-cog me-2" />
                        Cài đặt
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/MyAccountAddress">
                        <i className="fas fa-map-marker-alt me-2" />
                        Địa chỉ
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/MyAcconutPaymentMethod">
                        <i className="fas fa-credit-card me-2" />
                        Phương thức thanh toán
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/MyAcconutNotification">
                        <i className="fas fa-bell me-2" />
                        Thông báo
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <hr />
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link " to="/">
                        <i className="fas fa-sign-out-alt me-2" />
                        Log out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-9 col-md-8 col-12">
                <div>
                  {loaderStatus ? (
                    <div className="loader-container">
                      {/* <PulseLoader loading={loaderStatus} size={50} color="#0aad0a" /> */}
                      <MagnifyingGlass
                        visible={true}
                        height="100"
                        width="100"
                        ariaLabel="magnifying-glass-loading"
                        wrapperStyle={{}}
                        wrapperclassName="magnifying-glass-wrapper"
                        glassColor="#c0efff"
                        color="#0aad0a"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="p-lg-10">
                        {/* heading */}
                        <h2 className="mb-6">Đơn đặt hàng của bạn</h2>
                        <div className="table-responsive border">
                          {/* Table */}
                          <table className="table mb-0 text-nowrap">
                            <thead className="table-light">
                              <tr>
                                <th className="border-0">#</th>
                                <th className="border-0">Name</th>
                                <th className="border-0">Date</th>
                                <th className="border-0">Status</th>
                                <th className="border-0">Amount</th>
                                <th className="border-0" />
                              </tr>
                            </thead>
                            <tbody>
                              {orders.map((order, index) => (
                                <>
                                  <tr key={index}>
                                    <td className="align-middle border-top-0">
                                      <button
                                        className="btn btn-link p-0"
                                        onClick={() => toggleRow(index)}
                                      >
                                        {expandedRows[index] ? (
                                          <FiChevronUp size="16" />
                                        ) : (
                                          <FiChevronDown size="16" />
                                        )}
                                      </button>
                                    </td>
                                    <td className="align-middle border-top-0">
                                      <Link
                                        to="#"
                                        className="fw-semi-bold text-inherit"
                                      >
                                        <h6 className="mb-0">{order.name}</h6>
                                      </Link>
                                    </td>
                                    <td className="align-middle border-top-0">
                                      {order.date}
                                    </td>
                                    <td className="align-middle border-top-0">
                                      <span
                                        className={`badge ${order.badgeClass}`}
                                      >
                                        {order.status}
                                      </span>
                                    </td>
                                    <td className="align-middle border-top-0">
                                      {order.price.toLocaleString()} VNĐ
                                    </td>
                                    <td className="text-muted align-middle border-top-0">
                                      <Link to="#" className="text-inherit">
                                        <i className="feather-icon icon-eye" />
                                      </Link>
                                    </td>
                                  </tr>
                                  {expandedRows[index] && (
                                    <tr>
                                      <td colSpan="6" className="border-top-0">
                                        <div className="p-1">
                                          <strong>Chi tiết đơn hàng:</strong>
                                          <table className="table table-bordered mt-2">
                                            <thead className="table-light">
                                              <tr>
                                                <th>#</th>
                                                <th>Product Name</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                <th>Total</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {order.products.map((product) => (
                                                <tr key={product.id}>
                                                  <td>
                                                    {" "}
                                                    <Link to="#!">
                                                      <img
                                                        src={product.src}
                                                        alt={product.alt}
                                                        className="mb-3 img-fluid"
                                                        style={{
                                                          width: "50px",
                                                          height: "50px",
                                                        }}
                                                      />
                                                    </Link>
                                                  </td>
                                                  <td>{product.name}</td>
                                                  <td>{product.quantity}</td>
                                                  <td>
                                                    {product.price.toLocaleString()}{" "}
                                                    VNĐ
                                                  </td>
                                                  <td>
                                                    {(
                                                      product.quantity *
                                                      product.price
                                                    ).toLocaleString()}{" "}
                                                    VNĐ
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </div>
  );
};

export default MyAccountOrder;
