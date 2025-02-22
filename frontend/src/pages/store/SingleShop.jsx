import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";
import Grocerylogo from "../../images/Grocerylogo.png";
import cement from "../../images/cement.jpg";
import bricks from "../../images/bricks.jpg";
import sand from "../../images/sand.jpg";
import steel from "../../images/steel.jpg";
import tiles from "../../images/tiles.png";
import wood from "../../images/wood.jpg";
import glass from "../../images/glass.jpg";
import paint from "../../images/paint.jpg";
import plumbing from "../../images/plumbing.jpg";
import electrical from "../../images/electrical.jpg";
import roofing from "../../images/roofing.jpg";
import insulation from "../../images/insulation.jpg";
import graphics from "../../images/store-graphics.svg";
import { MagnifyingGlass } from "react-loader-spinner";
import Swal from "sweetalert2";
import ScrollToTop from "../ScrollToTop";
const SingleShop = () => {
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  const handleAddClick = () => {
    Swal.fire({
      icon: "success",
      title: "Added to Cart",
      text: "Product has been added to your cart!",
      showConfirmButton: true,
      timer: 3000,
    });
  };

  const materials = [
    { src: cement, alt: "cement", label: "Cement" },
    { src: bricks, alt: "bricks", label: "Bricks" },
    { src: sand, alt: "sand", label: "Sand" },
    { src: steel, alt: "steel", label: "Steel" },
    { src: tiles, alt: "tiles", label: "Tiles" },
    { src: wood, alt: "wood", label: "Wood" },
    { src: glass, alt: "glass", label: "Glass" },
    { src: paint, alt: "paint", label: "Paint" },
    { src: plumbing, alt: "plumbing", label: "Plumbing" },
    { src: electrical, alt: "electrical", label: "Electrical" },
    { src: roofing, alt: "roofing", label: "Roofing" },
    { src: insulation, alt: "insulation", label: "Insulation" },
  ];

  return (
    <div>
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
            <>
              <ScrollToTop />
            </>
            <>
              {/* section*/}
              <div className="mt-4">
                <div className="container">
                  {/* row */}
                  <div className="row">
                    {/* col */}
                    <div className="col-12">{/* breadcrumb */}</div>
                  </div>
                </div>
              </div>
            </>
            <>
              {/* section */}
              <section className="mb-lg-14 mb-8 mt-8">
                <div className="container">
                  {/* row */}
                  <div className="row">
                    <div className="col-12 col-lg-3 col-md-4 mb-4 mb-md-0">
                      <div className="d-flex flex-column">
                        <div>
                          {/* img */}
                          {/* img */}
                          <img
                            src={Grocerylogo}
                            style={{
                              width: 200,
                              marginBottom: 10,
                              marginLeft: "-15px",
                            }}
                            alt="eCommerce HTML Template"
                          />
                        </div>
                        {/* heading */}
                        <div className="mt-4">
                          <h1 className="mb-1 h4">E-Grocery Super Market</h1>
                          <div className="small text-muted">
                            <span>Everyday store prices </span>
                          </div>
                          <div>
                            <span>
                              <small>
                                <Link to="#!">100% satisfaction guarantee</Link>
                              </small>
                            </span>
                          </div>
                          {/* rating */}
                          <div className="mt-2">
                            {/* rating */}
                            <small className="text-warning">
                              <i className="bi bi-star-fill" />
                              <i className="bi bi-star-fill" />
                              <i className="bi bi-star-fill" />
                              <i className="bi bi-star-fill" />
                              <i className="bi bi-star-half" />
                            </small>
                            <span className="ms-2">5.0</span>
                            {/* text */}
                            <span className="text-muted ms-1">
                              (3,400 reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                      <hr />
                      {/* nav */}
                      <ul className="nav flex-column nav-pills nav-pills-dark">
                        {/* nav item */}
                        <li className="nav-item">
                          <Link
                            className="nav-link active"
                            aria-current="page"
                            to="#"
                          >
                            <i className="feather-icon icon-shopping-bag me-2" />
                            Shop
                          </Link>
                        </li>
                        {/* nav item */}
                        <li className="nav-item">
                          <Link className="nav-link" to="#">
                            <i className="fas fa-gift me-2" />
                            Deals
                          </Link>
                        </li>
                        {/* nav item */}
                        <li className="nav-item">
                          <Link className="nav-link" to="#">
                            <i className="fas fa-map-pin me-2" />
                            Buy It Again
                          </Link>
                        </li>
                        {/* nav item */}
                        <li className="nav-item">
                          <Link className="nav-link" to="#">
                            <i className="fas fa-star me-2" />
                            Reviews
                          </Link>
                        </li>
                        {/* nav item */}
                        <li className="nav-item">
                          <Link className="nav-link" to="#">
                            <i className="fas fa-book me-2" />
                            Recipes
                          </Link>
                        </li>
                        {/* nav item */}
                        <li className="nav-item">
                          <Link className="nav-link" to="#">
                            <i className="fas fa-phone-alt me-2" />
                            Contact
                          </Link>
                        </li>
                        {/* nav item */}
                        <li className="nav-item">
                          <Link className="nav-link" to="#">
                            <i className="fas fa-clipboard me-2" />
                            Policy
                          </Link>
                        </li>
                      </ul>
                      <hr />
                      <div>
                        <ul className="nav flex-column nav-links">
                          {/* nav item */}
                          {materials.map((material, index) => (
                            <li key={index} className="nav-item">
                              <Link to="#!" className="nav-link">
                              {material.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="col-12 col-lg-9 col-md-8">
                      <div className="mb-8 bg-light rounded-3 d-lg-flex justify-content-lg-between">
                        <div className="align-self-center p-8">
                          <div className="mb-3">
                            <h5 className="mb-0 fw-bold">
                              E-Grocery Super Market
                            </h5>
                            <p className="mb-0 text-muted">
                              Whatever the occasion, we've got you covered.
                            </p>
                          </div>
                          <div className="position-relative">
                            <input
                              type="email"
                              className="form-control"
                              id="exampleFormControlInput1"
                              placeholder="Search E-Grocery Super Market"
                            />
                            <span className="position-absolute end-0 top-0 mt-2 me-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={14}
                                height={14}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-search"
                              >
                                <circle cx={11} cy={11} r={8} />
                                <line x1={21} y1={21} x2="16.65" y2="16.65" />
                              </svg>
                            </span>
                          </div>
                        </div>
                        <div className="py-4">
                          {/* img */}
                          <img
                            src={graphics}
                            alt="stores"
                            className="img-fluid"
                          />
                        </div>
                      </div>
                      <div className="d-md-flex justify-content-between mb-3 align-items-center">
                        <div>
                          <p className="mb-3 mb-md-0">24 Products found</p>
                        </div>
                        <div className="d-flex justify-content-md-between align-items-center">
                          <div className="me-2">
                            {/* select option */}
                            <select
                              className="form-select"
                              aria-label="Default select example"
                            >
                              <option selected>Show: 50</option>
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                              <option value={30}>30</option>
                            </select>
                          </div>
                          <div>
                            {/* select option */}
                            <select
                              className="form-select"
                              aria-label="Default select example"
                            >
                              <option selected>Sort by: Featured</option>
                              <option value="Low to High">
                                Price: Low to High
                              </option>
                              <option value="High to Low">
                                Price: High to Low
                              </option>
                              <option value="Release Date">Release Date</option>
                              <option value="Avg. Rating">Avg. Rating</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      {/* row */}
                      <div className="row g-4 row-cols-xl-4 row-cols-lg-3 row-cols-2 row-cols-md-2 mt-2">
                        {materials.map((material, index) => (
                          <div key={index} className="col">
                            {/* card */}
                            <div className="card card-product">
                              <div className="card-body">
                                {/* Badge */}
                                <div className="text-center position-relative">
                                  <div className="position-absolute top-0 start-0">
                                    <span className="badge bg-danger">Hot</span>
                                  </div>
                                  <Link to="#!">
                                    <img
                                      src={material.src}
                                      alt={material.alt}
                                      className="mb-3 img-fluid"
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                      }}
                                    />
                                  </Link>
                                  {/* Action Buttons */}
                                  <div className="card-product-action">
                                    <Link
                                      to="#!"
                                      className="btn-action"
                                      data-bs-toggle="modal"
                                      data-bs-target="#quickViewModal"
                                    >
                                      <i
                                        className="bi bi-eye"
                                        data-bs-toggle="tooltip"
                                        data-bs-html="true"
                                        title="Quick View"
                                      />
                                    </Link>
                                    <Link
                                      to="shop-wishlist.html"
                                      className="btn-action"
                                      data-bs-toggle="tooltip"
                                      data-bs-html="true"
                                      title="Wishlist"
                                    >
                                      <i className="bi bi-heart" />
                                    </Link>
                                    <Link
                                      to="#!"
                                      className="btn-action"
                                      data-bs-toggle="tooltip"
                                      data-bs-html="true"
                                      title="Compare"
                                    >
                                      <i className="bi bi-arrow-left-right" />
                                    </Link>
                                  </div>
                                </div>
                                {/* Heading */}
                                <div className="text-small mb-1">
                                  <Link
                                    to="#!"
                                    className="text-decoration-none text-muted"
                                  >
                                    <small>{material.label}</small>
                                  </Link>
                                </div>
                                <h2 className="fs-6">
                                  <Link
                                    to="#!"
                                    className="text-inherit text-decoration-none"
                                  >
                                    {material.label} VIP
                                  </Link>
                                </h2>
                                <div>
                                  <small className="text-warning">
                                    <i className="bi bi-star-fill" />
                                    <i className="bi bi-star-fill" />
                                    <i className="bi bi-star-fill" />
                                    <i className="bi bi-star-fill" />
                                    <i className="bi bi-star-half" />
                                  </small>
                                  <span className="text-muted small">
                                    {" "}
                                    4.5(149)
                                  </span>
                                </div>
                                {/* Price */}
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                  <div>
                                    <span className="text-dark">$18</span>
                                    <span className="text-decoration-line-through text-muted">
                                      {" "}
                                      $24
                                    </span>
                                  </div>
                                  <div>
                                    <button
                                      className="btn btn-warning btn-sm"
                                      onClick={handleAddClick}
                                    >
                                      + Add
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* row */}
                      <div className="row mt-8">
                        <div className="col">
                          {/* nav */}
                          <nav>
                            <ul className="pagination">
                              <li className="page-item disabled">
                                <Link
                                  className="page-link mx-1 rounded-3"
                                  to="#"
                                  aria-label="Previous"
                                >
                                  <i className="fa fa-chevron-left" />
                                </Link>
                              </li>
                              <li className="page-item">
                                <Link
                                  className="page-link mx-1 rounded-3 active"
                                  to="#"
                                >
                                  1
                                </Link>
                              </li>
                              <li className="page-item">
                                <Link
                                  className="page-link mx-1 rounded-3 text-body"
                                  to="#"
                                >
                                  2
                                </Link>
                              </li>
                              <li className="page-item">
                                <Link
                                  className="page-link mx-1 rounded-3 text-body"
                                  to="#"
                                >
                                  ...
                                </Link>
                              </li>
                              <li className="page-item">
                                <Link
                                  className="page-link mx-1 rounded-3 text-body"
                                  to="#"
                                >
                                  12
                                </Link>
                              </li>
                              <li className="page-item">
                                <Link
                                  className="page-link mx-1 rounded-3 text-body"
                                  to="#"
                                  aria-label="Next"
                                >
                                  <i className="fa fa-chevron-right" />
                                </Link>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          </>
        )}
      </div>
    </div>
  );
};

export default SingleShop;
