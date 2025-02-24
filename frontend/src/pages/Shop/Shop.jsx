import React, { useEffect, useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import assortment from "../../images/assortment.jpg";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
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
import Swal from "sweetalert2";
import ScrollToTop from "../ScrollToTop";

function Dropdown() {
  const handleAddClick = () => {
    Swal.fire({
      icon: "success",
      title: "Added to Cart",
      text: "Product has been added to your cart!",
      showConfirmButton: true,
      timer: 3000,
    });
  };

  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

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
          <div className="container ">
            <div className="row">
              {/* Vertical Dropdowns Column */}
              <div className="col-md-3">
                <div>
                  <div className="py-4">
                    <h5 className="mb-3">Stores</h5>
                    <div className="my-4">
                      {/* input */}
                      <input
                        type="search"
                        className="form-control"
                        placeholder="Search by store"
                      />
                    </div>
                    {/* form check */}
                    <div className="form-check mb-2">
                      {/* input */}
                      <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue
                        id="eGrocery"
                        defaultChecked
                      />
                      <label className="form-check-label" htmlFor="eGrocery">
                        E-Grocery
                      </label>
                    </div>
                    {/* form check */}
                    <div className="form-check mb-2">
                      {/* input */}
                      <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue
                        id="DealShare"
                      />
                      <label className="form-check-label" htmlFor="DealShare">
                        DealShare
                      </label>
                    </div>
                    {/* form check */}
                    <div className="form-check mb-2">
                      {/* input */}
                      <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue
                        id="Dmart"
                      />
                      <label className="form-check-label" htmlFor="Dmart">
                        DMart
                      </label>
                    </div>
                    {/* form check */}
                    <div className="form-check mb-2">
                      {/* input */}
                      <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue
                        id="Blinkit"
                      />
                      <label className="form-check-label" htmlFor="Blinkit">
                        Blinkit
                      </label>
                    </div>
                    {/* form check */}
                    <div className="form-check mb-2">
                      {/* input */}
                      <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue
                        id="BigBasket"
                      />
                      <label className="form-check-label" htmlFor="BigBasket">
                        BigBasket
                      </label>
                    </div>
                    {/* form check */}
                    <div className="form-check mb-2">
                      {/* input */}
                      <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue
                        id="StoreFront"
                      />
                      <label className="form-check-label" htmlFor="StoreFront">
                        StoreFront
                      </label>
                    </div>
                    {/* form check */}
                    <div className="form-check mb-2">
                      {/* input */}
                      <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue
                        id="Spencers"
                      />
                      <label className="form-check-label" htmlFor="Spencers">
                        Spencers
                      </label>
                    </div>
                    {/* form check */}
                    <div className="form-check mb-2">
                      {/* input */}
                      <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue
                        id="onlineGrocery"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="onlineGrocery"
                      >
                        Online Grocery
                      </label>
                    </div>
                  </div>
                  <div className="py-4">
                    {/* price */}
                    <h5 className="mb-3">Price</h5>
                    <div>
                      {/* range */}
                      <div id="priceRange" className="mb-3" />
                      <small className="text-muted">Price:</small>{" "}
                      <span id="priceRange-value" className="small" />
                    </div>
                  </div>
                  {/* rating */}
                  <div className="py-4">
                    <h5 className="mb-3">Rating</h5>
                    <div>
                      {/* form check */}
                      <div className="form-check mb-2">
                        {/* input */}
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="ratingFive"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="ratingFive"
                        >
                          <i className="bi bi-star-fill text-warning" />
                          <i className="bi bi-star-fill text-warning " />
                          <i className="bi bi-star-fill text-warning " />
                          <i className="bi bi-star-fill text-warning " />
                          <i className="bi bi-star-fill text-warning " />
                        </label>
                      </div>
                      {/* form check */}
                      <div className="form-check mb-2">
                        {/* input */}
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="ratingFour"
                          defaultChecked
                        />
                        <label
                          className="form-check-label"
                          htmlFor="ratingFour"
                        >
                          <i className="bi bi-star-fill text-warning" />
                          <i className="bi bi-star-fill text-warning " />
                          <i className="bi bi-star-fill text-warning " />
                          <i className="bi bi-star-fill text-warning " />
                          <i className="bi bi-star text-warning" />
                        </label>
                      </div>
                      {/* form check */}
                      <div className="form-check mb-2">
                        {/* input */}
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="ratingThree"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="ratingThree"
                        >
                          <i className="bi bi-star-fill text-warning" />
                          <i className="bi bi-star-fill text-warning " />
                          <i className="bi bi-star-fill text-warning " />
                          <i className="bi bi-star text-warning" />
                          <i className="bi bi-star text-warning" />
                        </label>
                      </div>
                      {/* form check */}
                      <div className="form-check mb-2">
                        {/* input */}
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="ratingTwo"
                        />
                        <label className="form-check-label" htmlFor="ratingTwo">
                          <i className="bi bi-star-fill text-warning" />
                          <i className="bi bi-star-fill text-warning" />
                          <i className="bi bi-star text-warning" />
                          <i className="bi bi-star text-warning" />
                          <i className="bi bi-star text-warning" />
                        </label>
                      </div>
                      {/* form check */}
                      <div className="form-check mb-2">
                        {/* input */}
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="ratingOne"
                        />
                        <label className="form-check-label" htmlFor="ratingOne">
                          <i className="bi bi-star-fill text-warning" />
                          <i className="bi bi-star text-warning" />
                          <i className="bi bi-star text-warning" />
                          <i className="bi bi-star text-warning" />
                          <i className="bi bi-star text-warning" />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="py-4">
                    {/* Banner Design */}
                    {/* Banner Content */}
                    <div className="position-absolute p-5 py-8">
                      <h3 className="mb-0">Sell Off </h3>
                      <p className=" text-white">Get Upto 25%</p>
                      <Link to="#" className="btn btn-warning">
                        Shop Now
                        <i className="feather-icon icon-arrow-right ms-1" />
                      </Link>
                    </div>
                    {/* Banner Content */}
                    {/* Banner Image */}
                    {/* img */}
                    <img
                      src={assortment}
                      alt="assortment"
                      className="img-fluid rounded-3"
                    />
                    {/* Banner Image */}
                  </div>
                  {/* Banner Design */}
                </div>
              </div>
              {/* Cards Column */}
              <div className="col-lg-9 col-md-8">
                {/* card */}
                <div className="card mb-4 bg-light border-0">
                  {/* card body */}
                  <div className=" card-body p-9">
                    <h1 className="mb-0">Cement</h1>
                  </div>
                </div>
                {/* list icon */}
                <div className="d-md-flex justify-content-between align-items-center">
                  <div>
                    <p className="mb-3 mb-md-0">
                      {" "}
                      <span className="text-dark">24 </span> Products found{" "}
                    </p>
                  </div>
                  {/* icon */}
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to="/ShopListCol" className="text-muted me-3">
                      <i className="bi bi-list-ul" />
                    </Link>
                    <Link to="/ShopGridCol3" className="text-muted me-3">
                      <i className="bi bi-grid" />
                    </Link>
                    <Link to="/Shop" className="me-3 active">
                      <i className="bi bi-grid-3x3-gap" />
                    </Link>
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
                        <option value="Low to High">Price: Low to High</option>
                        <option value="High to Low"> Price: High to Low</option>
                        <option value="Release Date"> Release Date</option>
                        <option value="Avg. Rating"> Avg. Rating</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* row */}
                <div className="row g-4 row-cols-xl-6 row-cols-lg-4 row-cols-md-3 row-cols-2 mt-2">
                  {/* col */}
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
                                style={{width: "100px", height: "100px"}}
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
                            <span className="text-muted small"> 4.5(149)</span>
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
                <div className="row mt-8">
                  <div className="col">
                    {/* nav */}
                    <nav>
                      <ul className="pagination">
                        <li className="page-item disabled">
                          <Link
                            className="page-link  mx-1 rounded-3 "
                            to="#"
                            aria-label="Previous"
                          >
                            <i className="fa fa-chevron-left" />
                          </Link>
                        </li>
                        <li className="page-item ">
                          <Link
                            className="page-link  mx-1 rounded-3 active"
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
        </>
      )}
    </div>
  );
}

export default Dropdown;
