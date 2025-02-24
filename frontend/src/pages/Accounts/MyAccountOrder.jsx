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
      ],
      price: 10 * 90000 + 10 * 15000,
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

              {/* <div> */}
              <div className="col-12">
                <div className="p-6 d-flex justify-content-between align-items-center d-md-none">
                  {/* heading */}
                  <h3 className="fs-5 mb-0">Account Setting</h3>
                  {/* button */}
                  <button
                    className="btn btn-outline-gray-400 text-muted d-md-none"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasAccount"
                    aria-controls="offcanvasAccount"
                  >
                    <i className="fas fa-bars"></i>
                  </button>
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
                        Your Orders
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/MyAccountSetting">
                        <i className="fas fa-cog me-2" />
                        Settings
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/MyAccountAddress">
                        <i className="fas fa-map-marker-alt me-2" />
                        Address
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/MyAcconutPaymentMethod">
                        <i className="fas fa-credit-card me-2" />
                        Payment Method
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/MyAcconutNotification">
                        <i className="fas fa-bell me-2" />
                        Notification
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <hr />
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link " to="/Grocery-react/">
                        <i className="fas fa-sign-out-alt me-2" />
                        Log out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              {/* </div> */}

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
                      <div className="p-6 p-lg-10">
                        {/* heading */}
                        <h2 className="mb-6">Your Orders</h2>
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
                                          <strong>Orders:</strong>
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
      <>
        {/* modal */}
        <div
          className="offcanvas offcanvas-start"
          tabIndex={-1}
          id="offcanvasAccount"
          aria-labelledby="offcanvasAccountLabel"
        >
          {/* offcanvas header */}
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasAccountLabel">
              My Account
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </div>
          {/* offcanvas body */}
          <div className="offcanvas-body">
            <ul className="nav flex-column nav-pills nav-pills-dark">
              {/* nav item */}
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/MyAccountOrder"
                >
                  <i className="fas fa-shopping-bag me-2" />
                  Your Orders
                </a>
              </li>
              {/* nav item */}
              <li className="nav-item">
                <a className="nav-link " href="/MyAccountSetting">
                  <i className="fas fa-cog me-2" />
                  Settings
                </a>
              </li>
              {/* nav item */}
              <li className="nav-item">
                <a className="nav-link" href="/MyAccountAddress">
                  <i className="fas fa-map-marker-alt me-2" />
                  Address
                </a>
              </li>
              {/* nav item */}
              <li className="nav-item">
                <a className="nav-link" href="/MyAcconutPaymentMethod">
                  <i className="fas fa-credit-card me-2" />
                  Payment Method
                </a>
              </li>
              {/* nav item */}
              <li className="nav-item">
                <a className="nav-link" href="/MyAcconutNotification">
                  <i className="fas fa-bell me-2" />
                  Notification
                </a>
              </li>
            </ul>
            <hr className="my-6" />
            <div>
              {/* nav  */}
              <ul className="nav flex-column nav-pills nav-pills-dark">
                {/* nav item */}
                <li className="nav-item">
                  <a className="nav-link " href="/Grocery-react/">
                    <i className="fas fa-sign-out-alt me-2" />
                    Log out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default MyAccountOrder;
