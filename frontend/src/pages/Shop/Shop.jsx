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

function Dropdown() {
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState([]);
  const [selectedSku, setSelectedSku] = useState(null);
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

        if (!shopResponse.ok || !cateResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const shopData = await shopResponse.json();
        const cateData = await cateResponse.json();
        setStores(shopData.content || []);
        setCategories(cateData || {});
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoaderStatus(false);
      }
    };

    fetchData();
  }, [cateId]);

  const handleAddWishList = (product) => {
    let wishList = JSON.parse(localStorage.getItem("wishList")) || [];
    const existingProductIndex = wishList.findIndex(
      (item) => item.id === product.id
    );
    if (existingProductIndex !== -1) {
      wishList[existingProductIndex].quantity += 1;
    } else {
      wishList.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("wishList", JSON.stringify(wishList));

    setTimeout(() => {
      Swal.fire({
        icon: "info",
        title: "Thêm vào danh sách yêu thích",
        text: "Sản phẩm đã được thêm danh sách yêu thích bạn!",
        showConfirmButton: true,
        timer: 2000,
      });
    }, 100);
  };

  const handleAddCart = (productSKUId, quantity = 1) => {
    if (!productSKUId || quantity <= 0) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Thông tin sản phẩm không hợp lệ!",
      });
      return;
    }

    const fetchAddCart = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/cart/add?shopId=${cateId}&productSKUId=${productSKUId}&quantity=${quantity}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Thêm vào giỏ hàng",
            text: "Sản phẩm đã được thêm vào giỏ hàng!",
          });
        } else {
          throw new Error("Không thể thêm sản phẩm vào giỏ hàng.");
        }

        Swal.fire({
          icon: "success",
          title: "Thêm vào giỏ hàng",
          text: "Sản phẩm đã được thêm vào giỏ hàng của bạn!",
          showConfirmButton: true,
          timer: 2000,
        });
      } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.",
        });
      }
    };

    fetchAddCart();
  };

  const getProduct = (id) => {
    const fetchProductById = async () => {
      try {
        const product = await fetch(`${BASE_URL}/api/public/product/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!product.ok) {
          throw new Error("Network response was not ok");
        }
        const dataProduct = await product.json();
        setProduct(dataProduct);
        setSelectedSku(dataProduct?.skus?.[0]);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProductById();
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
          <div className="container ">
            <div className="row">
              {/* Vertical Dropdowns Column */}
              <div className="col-md-3">
                <div>
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
                            to={"/SingleShop"}
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
                          <label
                            className="form-check-label"
                            htmlFor={rating.id}
                          >
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
                    <h1 className="mb-0">{categories.name}</h1>
                  </div>
                </div>
                {/* list icon */}
                <div className="d-md-flex justify-content-between align-items-center">
                  <div>
                    <p className="mb-3 mb-md-0">
                      {" "}
                      <span className="text-dark">
                        {categories.products.length}{" "}
                      </span>{" "}
                      sản phẩm{" "}
                    </p>
                  </div>
                  {/* icon */}
                  <div className="d-flex justify-content-between align-items-center">
                    {/* <Link to="/ShopListCol" className="text-muted me-3">
                      <i className="bi bi-list-ul" />
                    </Link>
                    <Link to="/ShopGridCol3" className="text-muted me-3">
                      <i className="bi bi-grid" />
                    </Link> */}
                    <Link to={`/Shop/${cateId}`} className="me-3 active">
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
                <div className="row g-4 row-cols-xl-12 row-cols-lg-4 row-cols-md-3 row-cols-2 mt-2">
                  {/* col */}
                  {categories.products.map((p, index) => {
                    const isInWishlist = storedWishlist.some(
                      (item) => item.id === p.id
                    );
                    return (
                      <div key={index} className="col">
                        {/* card */}
                        <div className="card card-product">
                          <div className="card-body">
                            {/* Badge */}
                            <div className="text-center position-relative">
                              <Link>
                                <img
                                  src={image1}
                                  alt={p.images}
                                  className="mb-3 img-fluid"
                                  style={{
                                    width: "150px",
                                    height: "150px",
                                  }}
                                />
                              </Link>
                              {/* Action Buttons */}
                              <div className="card-product-action">
                                <Link
                                  to="#!"
                                  className="btn-action"
                                  data-bs-toggle="modal"
                                  data-bs-target="#ViewProduct"
                                  onClick={() => getProduct(p.id)}
                                >
                                  <i
                                    className="bi bi-eye"
                                    data-bs-toggle="tooltip"
                                    data-bs-html="true"
                                    title="Quick View"
                                  />
                                </Link>
                                <Link
                                  onClick={
                                    isInWishlist
                                      ? null
                                      : () => handleAddWishList(p)
                                  }
                                  className={`btn-action ${
                                    isInWishlist ? "disabled text-warning" : ""
                                  }`}
                                  data-bs-toggle="tooltip"
                                  data-bs-html="true"
                                  title="Wishlist"
                                >
                                  <i
                                    className={`bi ${
                                      isInWishlist
                                        ? "bi-heart-fill"
                                        : "bi-heart"
                                    }`}
                                  />
                                </Link>
                              </div>
                            </div>
                            {/* Heading */}
                            <div className="text-small mb-1"></div>
                            <h2 className="fs-6">
                              <Link
                                to="#!"
                                className="text-inherit text-decoration-none"
                              >
                                {p?.name}
                              </Link>
                              <br />
                              <small>{p.description}</small>
                              <br />
                              <small>{p.specifications}</small>
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
              </div>
            </div>
          </div>
        </>
      )}
      <div
        className="modal fade"
        id="ViewProduct"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="paymentModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          {/* modal content */}
          <div className="modal-content">
            {/* modal header */}
            <div className="modal-header align-items-center d-flex">
              <h5 className="modal-title" id="paymentModalLabel">
                Chi tiết sản phẩm
              </h5>
              {/* button */}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            {/* Modal body */}
            <div className="modal-body">
              <div className="row">
                {/* Hình ảnh bên trái */}
                <div className="col-md-4">
                  <img
                    src={image1}
                    alt="Sản phẩm"
                    className="img-fluid rounded"
                  />
                </div>

                {/* Mô tả bên phải */}
                <div className="col-md-8">
                  <h4 className="mb-3">Tên sản phẩm: {product?.name}</h4>
                  <p>{product?.description}</p>
                  <p>{product?.specifications}</p>
                </div>
                <div className="col-md-12">
                  {product?.skus?.length > 0 ? (
                    <>
                      {product.skus.map((p, index) => (
                        <img
                          key={index}
                          src={image1 || "default-image.jpg"}
                          alt="Sản phẩm"
                          className={`img-fluid rounded border m-1 ${
                            selectedSku === p
                              ? "border-primary"
                              : "border-black"
                          }`}
                          style={{
                            height: "70px",
                            width: "70px",
                            cursor: "pointer",
                          }}
                          onClick={() => setSelectedSku(p)}
                        />
                      ))}
                    </>
                  ) : (
                    <p>Loading...</p>
                  )}
                  {selectedSku && (
                    <div className="mt-3">
                      <p>Màu sắc: {selectedSku.skuCode}</p>
                      <p>Số lượng: {selectedSku.stock}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="text-decoration-line-through text-muted">
                            Giá gốc: {selectedSku.sellingPrice} VNĐ
                          </span>
                          <br />
                          <span className="text-danger">
                            {" "}
                            Giá khuyến mãi: {selectedSku.costPrice} VNĐ
                          </span>
                        </div>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleAddCart(selectedSku.id, 1)}
                        >
                          + Thêm vào giỏ hàng
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dropdown;
