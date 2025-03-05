import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import assortment from "../../images/assortment.jpg";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Swal from "sweetalert2";
import ScrollToTop from "../ScrollToTop";
import { BASE_URL } from "../../Utils/config";
import image1 from "../../images/glass.jpg";
import ShopProductDetail from "./ShopProductDetail";

function Dropdown() {
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { cateId } = useParams();
  const storedWishlist = JSON.parse(localStorage.getItem("wishList")) || [];

  const ratings = [
    { id: "ratingFive", stars: 5 },
    { id: "ratingFour", stars: 4 },
    { id: "ratingThree", stars: 3 },
    { id: "ratingTwo", stars: 2 },
    { id: "ratingOne", stars: 1 },
  ];

  useEffect(() => {
    if (!cateId) return;

    const fetchData = async () => {
      try {
        setLoaderStatus(true);
        const params = new URLSearchParams({
          page: 1,
          size: 10,
          sortBy: "id",
          direction: "ASC",
        });

        const [shopResponse, cateResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/public/shops?${params.toString()}`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${BASE_URL}/api/public/categories/${cateId}`, {
            method: "GET",
            credentials: "include",
          }),
        ]);

        if (shopResponse.ok && cateResponse.ok) {
          const [shopData, cateData] = await Promise.all([
            shopResponse.json(),
            cateResponse.json(),
          ]);
          setStores(shopData.content || []);
          setCategories(cateData || {});
        } else {
          throw new Error("Lỗi khi tải dữ liệu");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoaderStatus(false);
      }
    };

    fetchData();
  }, [cateId]);

  const handleAddWishList = (product) => {
    const wishList = JSON.parse(localStorage.getItem("wishList")) || [];
    const existingProduct = wishList.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      wishList.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("wishList", JSON.stringify(wishList));

    Swal.fire({
      icon: "info",
      title: "Thêm vào danh sách yêu thích",
      text: "Sản phẩm đã được thêm vào danh sách yêu thích!",
      showConfirmButton: true,
      timer: 2000,
    });
  };

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
          <div className="container">
            <div className="row fixed-side">
              {/* Vertical Dropdowns Column */}
              <div className="col-md-3">
                <div className="py-4">
                  <h5 className="mb-3">Danh sách cửa hàng</h5>
                  <div className="my-4">
                    {/* input */}
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Tìm kiếm cửa hàng..."
                    />
                  </div>
                  {stores.length > 0 ? (
                    stores.map((stores, index) => (
                      <div className="form-check mb-2" key={index}>
                        {/* input */}
                        <Link
                          to={`/SingleShop/${stores.id}`}
                          className="form-check-label"
                          htmlFor="eGrocery"
                        >
                          {stores.shopType}
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="dropdown-item">Đang tải...</p>
                  )}
                  {/* form check */}
                </div>
                <div className="py-4">
                  {/* price */}
                  <h5 className="mb-3">Giá thành</h5>
                  <div>
                    {/* range */}
                    <div id="priceRange" className="mb-3" />
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Nhập số..."
                    />
                    <span id="priceRange-value" className="small" />
                  </div>
                </div>
                {/* rating */}
                <div className="py-4">
                  <h5 className="mb-3">Đánh giá</h5>
                  <div>
                    {ratings.map((rating, index) => (
                      <div className="form-check mb-2" key={index}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={rating.id}
                          defaultChecked={rating.stars === 5}
                        />
                        <label className="form-check-label" htmlFor={rating.id}>
                          {Array.from({ length: 5 }, (_, i) => (
                            <i
                              key={i}
                              className={`bi ${
                                i < rating.stars ? "bi-star-fill" : "bi-star"
                              } text-warning`}
                            />
                          ))}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="py-4">
                  {/* Banner Design */}
                  {/* Banner Content */}
                  <div className="position-absolute p-5 py-8">
                    <h3 className="mb-0">Sell Off </h3>
                    <p className=" text-white">Get Upto 25%</p>
                    <Link to="#" className="btn btn-dark">
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
                <div className="card-body p-9">
                  <h1 className="mb-0">{categories.name}</h1>
                </div>
              </div>
              {/* list icon */}
              {selectedProduct ? (
                <ShopProductDetail
                  id={selectedProduct.id}
                  onBack={() => setSelectedProduct(null)}
                />
              ) : (
                <>
                  <div className="d-md-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-3 mb-md-0">
                        {" "}
                        <span className="text-dark">
                          Có {categories.products.length}{" "}
                        </span>{" "}
                        sản phẩm{" "}
                      </p>
                    </div>
                    {/* icon */}
                    <div className="d-flex justify-content-between align-items-center">
                      <Link
                        to={`/ShopListCol/${cateId}`}
                        className=" me-3 active"
                      >
                        <i className="bi bi-list-ul" />
                      </Link>
                      <Link
                        to={`/ShopGridCol3/${cateId}`}
                        className="text-muted me-3"
                      >
                        <i className="bi bi-grid" />
                      </Link>
                      <Link to={`/Shop/${cateId}`} className="me-3 text-muted">
                        <i className="bi bi-grid-3x3-gap" />
                      </Link>
                      <div className="me-2">
                        {/* select option */}
                        <select
                          className="form-select"
                          aria-label="Default select example"
                        >
                          <option selected>50</option>
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
                          <option selected> Sắp xếp theo: Nổi bật </option>
                          <option value="Low to High">
                            {" "}
                            Giá: Từ thấp đến cao{" "}
                          </option>
                          <option value="High to Low">
                            {" "}
                            Giá: Từ cao đến thấp{" "}
                          </option>
                          <option value="Release Date"> Ngày phát hành </option>
                          <option value="Avg. Rating">
                            {" "}
                            Đánh giá trung bình{" "}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* row */}
                  <div className="row g-4  row-cols-1 mt-2">
                    {/* col */}
                    {categories.products.map((p, index) => {
                      const isInWishlist = storedWishlist.some(
                        (item) => item.id === p.id
                      );
                      return (
                        <div key={index} className="col">
                          {/* card */}
                          <div className="card card-product">
                            {/* card body */}
                            <div className="card-body">
                              <div className=" row align-items-center">
                                {/* col */}
                                <div className="col-md-4 col-12">
                                  <div className="text-center position-relative ">
                                    <div className=" position-absolute top-0">
                                      {/* badge */}{" "}
                                      <span className="badge bg-danger">
                                        Hot
                                      </span>
                                    </div>
                                    <Link to="#!">
                                      {/* img */}
                                      <img
                                        src={image1}
                                        alt={p.images}
                                        className="mb-3 img-fluid"
                                      />
                                    </Link>
                                  </div>
                                </div>
                                <div className="col-md-8 col-12 flex-grow-1">
                                  {/* heading */}
                                  <div className="text-small mb-1"></div>
                                  <Link
                                    to="#!"
                                    className="text-decoration-none text-muted"
                                  >
                                    {p?.name}
                                  </Link>
                                  <h2 className="fs-6">
                                    <br />
                                    <small>{p.description}</small>
                                    <br />
                                    <small>{p.specifications}</small>
                                  </h2>
                                  <div>
                                    {/* rating */}
                                    <small className="text-warning">
                                      {" "}
                                      <i className="bi bi-star-fill" />
                                      <i className="bi bi-star-fill" />
                                      <i className="bi bi-star-fill" />
                                      <i className="bi bi-star-fill" />
                                      <i className="bi bi-star-half" />
                                    </small>{" "}
                                    <span className="text-muted small">
                                      4.5(149)
                                    </span>
                                  </div>
                                  {/* Price */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dropdown;
