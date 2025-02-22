import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import cement from "../images/cement.jpg";
import bricks from "../images/bricks.jpg";
import sand from "../images/sand.jpg";
import steel from "../images/steel.jpg";
import tiles from "../images/tiles.png";
import wood from "../images/wood.jpg";
import glass from "../images/glass.jpg";
import paint from "../images/paint.jpg";
import plumbing from "../images/plumbing.jpg";
import electrical from "../images/electrical.jpg";

const products = [
  { id: 1, name: "Cement", category: "Building Materials", price: 50, originalPrice: 60, rating: 4.5, reviews: 120, image: cement },
  { id: 2, name: "Bricks", category: "Building Materials", price: 10, originalPrice: 15, rating: 4.3, reviews: 98, image: bricks },
  { id: 3, name: "Sand", category: "Building Materials", price: 30, originalPrice: 40, rating: 4.2, reviews: 85, image: sand },
  { id: 4, name: "Steel", category: "Building Materials", price: 100, originalPrice: 120, rating: 4.7, reviews: 150, image: steel },
  { id: 5, name: "Tiles", category: "Building Materials", price: 80, originalPrice: 95, rating: 4.6, reviews: 110, image: tiles },
  { id: 6, name: "Wood", category: "Building Materials", price: 90, originalPrice: 105, rating: 4.4, reviews: 100, image: wood },
  { id: 7, name: "Glass", category: "Building Materials", price: 70, originalPrice: 85, rating: 4.3, reviews: 95, image: glass },
  { id: 8, name: "Paint", category: "Building Materials", price: 60, originalPrice: 75, rating: 4.5, reviews: 125, image: paint },
  { id: 9, name: "Plumbing", category: "Building Materials", price: 55, originalPrice: 65, rating: 4.2, reviews: 90, image: plumbing },
  { id: 10, name: "Electrical", category: "Building Materials", price: 65, originalPrice: 80, rating: 4.6, reviews: 130, image: electrical },
];

const ProductItem = () => {
  const handleAddClick = () => {
    Swal.fire({
      icon: "success",
      title: "Added to Cart",
      text: "Product has been added to your cart!",
      showConfirmButton: true,
      timer: 3000,
    });
  };

  return (
    <div>
      {/* Popular Products Start */}
      <section className="my-lg-14 my-8">
        <div className="container">
          <div className="row">
            <div className="col-12 mb-6">
              <div className="section-head text-center">
                <h3 className="h3style" data-title="Popular Products">
                  Popular Products
                </h3>
                <div className="wt-separator bg-primarys"></div>
                <div className="wt-separator2 bg-primarys"></div>
              </div>
            </div>
          </div>
          <div className="row g-4 row-cols-lg-5 row-cols-2 row-cols-md-3">
            {products.map((product) => (
              <div key={product.id} className="col fade-zoom">
                <div className="card card-product">
                  <div className="card-body">
                    <div className="text-center position-relative">
                      <div className="position-absolute top-0 start-0">
                        <span className="badge bg-danger">Hot</span>
                      </div>
                      <Link to="#">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="mb-3 img-fluid"
                          style={{ height: "200px", width: "200px" }}
                        />
                      </Link>
                      <div className="card-product-action">
                        <Link
                          to="#"
                          className="btn-action"
                          data-bs-toggle="modal"
                          data-bs-target="#quickViewModal"
                        >
                          <i className="bi bi-eye" title="Quick View" />
                        </Link>
                        <Link to="#" className="btn-action" title="Wishlist">
                          <i className="bi bi-heart" />
                        </Link>
                        <Link to="#" className="btn-action" title="Compare">
                          <i className="bi bi-arrow-left-right" />
                        </Link>
                      </div>
                    </div>
                    <div className="text-small mb-1">
                      <Link to="#" className="text-decoration-none text-muted">
                        <small>{product.category}</small>
                      </Link>
                    </div>
                    <h2 className="fs-6">
                      <Link
                        to="#"
                        className="text-inherit text-decoration-none"
                      >
                        {product.name}
                      </Link>
                    </h2>
                    <div>
                      <small className="text-warning">
                        {[...Array(5)].map((_, index) => (
                          <i
                            key={index}
                            className={
                              index < Math.floor(product.rating)
                                ? "bi bi-star-fill"
                                : "bi bi-star-half"
                            }
                          />
                        ))}
                      </small>
                      <span className="text-muted small">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <span className="text-dark">${product.price}</span>
                        <span className="text-decoration-line-through text-muted">
                          ${product.originalPrice}
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
        </div>
      </section>
      {/* Popular Products End */}
    </div>
  );
};

export default ProductItem;
