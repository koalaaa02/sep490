import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MagnifyingGlass } from "react-loader-spinner";
import Swal from "sweetalert2";
import ScrollToTop from "../ScrollToTop";
import { BASE_URL } from "../../Utils/config";
import image1 from "../../images/glass.jpg";
import ShopProductDetail from "../Shop/ShopProductDetail";
import ChatBox from "../Shop/ChatBox";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

const SingleShop = () => {
  const [stores, setStores] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { shopId } = useParams();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [direction, setDirection] = useState("ASC");
  const [searchName, setSearchName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const storedWishlist = JSON.parse(localStorage.getItem("wishList")) || [];
  const params = new URLSearchParams({
    page: page,
    size: size,
    sortBy: "id",
    direction: direction,
    active: true,
    name: searchQuery,
    shopId: shopId,
  });

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!shopId) return;

    const fetchData = async () => {
      try {
        const [shopRes, productRes] = await Promise.all([
          fetch(`${BASE_URL}/api/public/shops/${shopId}`, {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }),
          fetch(`${BASE_URL}/api/public/products?${params.toString()}`, {
            method: "GET",
            credentials: "include",
          }),
        ]);

        if (!shopRes.ok || !productRes.ok) {
          throw new Error("Fetch failed");
        }

        const [shopData, productData] = await Promise.all([
          shopRes.json(),
          productRes.json(),
        ]);

        setStores({
          ...shopData,
          products: productData?.content || [],
        });

        setProducts(productData);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu shop hoặc sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shopId]);

  const handleChange = (event) => {
    setSize(event.target.value);
  };

  const handleChangeDirection = (event) => {
    setDirection(event.target.value);
  };

  const totalPages = Math.ceil(products?.totalElements / size);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
  };

  const handleSearchClick = () => {
    setSearchQuery(searchName);
  };

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

  if (loading) {
    return (
      <div className="loader-container">
        <MagnifyingGlass
          visible={true}
          height="100"
          width="100"
          color="#0aad0a"
          glassColor="#c0efff"
        />
      </div>
    );
  }

  return (
    <div>
      <ScrollToTop />
      <section className="mb-8 mt-4">
        <div className="container">
          <div className="bg-light rounded-3 d-lg-flex justify-content-lg-between p-4 mb-5">
            <div>
              <h5 className="fw-bold">{stores?.name}</h5>
              <p>
                Chủ quản lý: {stores?.manager?.firstName}{" "}
                {stores?.manager?.lastName}
              </p>
              <p>Email: {stores?.manager?.email}</p>
              <p>Số điện thoại: {stores?.address?.phone}</p>
              <p>
                Địa chỉ: {stores?.address?.address}, {stores?.address?.ward},{" "}
                {stores?.address?.district}, {stores?.address?.province}
              </p>
              {token && <ChatBox selectedShopId={shopId} />}
              <div
                className="mt-2"
                style={{ position: "relative", width: "70%" }}
              >
                <input
                  className="form-control responsivesearch"
                  list="datalistOptions"
                  id="exampleDataList"
                  placeholder={`Tìm kiếm ...`}
                  value={searchName}
                  onChange={handleSearchChange}
                  style={{ paddingRight: "35px" }}
                />
                <FaSearch
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#aaa",
                  }}
                  onClick={handleSearchClick}
                />
              </div>
            </div>
            <img
              src={stores?.logoImage}
              alt="Shop Graphic"
              className="img-fluid rounded-circle icon-shape"
              style={{ height: "150px", width: "150px" }}
            />
          </div>

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
                    <span className="text-dark">
                      Có {products?.content?.length} sản phẩm
                    </span>
                  </p>
                </div>
                {/* icon */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="me-2">
                    {/* select option */}
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={size}
                      onChange={handleChange}
                    >
                      <option selected value={6}>
                        6
                      </option>
                      <option value={12}>12</option>
                      <option value={18}>18</option>
                    </select>
                  </div>
                  <div>
                    {/* select option */}
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={direction}
                      onChange={handleChangeDirection}
                    >
                      <option value={"ASC"} selected>
                        {" "}
                        Mới nhất{" "}
                      </option>
                      <option value={"DESC"}> Cũ nhất </option>
                    </select>
                  </div>
                </div>
              </div>
              {/* row */}
              <div className="row g-4 row-cols-xl-12 row-cols-lg-4 row-cols-md-3 row-cols-2 mt-2">
                {products?.content?.map((p, index) => {
                  const isInWishlist = storedWishlist.some(
                    (item) => item.id === p.id
                  );
                  return (
                    <div key={p.id} className="col fade-zoom">
                      <div className="card card-product">
                        <div className="card-body">
                          <div className="text-center position-relative">
                            <Link onClick={() => setSelectedProduct(p)}>
                              <img
                                src={p.images || image1}
                                alt={p.images}
                                className="mb-3 img-fluid"
                                style={{
                                  height: "200px",
                                  width: "200px",
                                  objectFit: "cover",
                                }}
                              />
                            </Link>
                            <div className="card-product-action">
                              <Link
                                className="btn-action"
                                onClick={() => setSelectedProduct(p)}
                              >
                                <i className="bi bi-eye" title="Quick View" />
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
                                    isInWishlist ? "bi-heart-fill" : "bi-heart"
                                  }`}
                                />
                              </Link>
                            </div>
                          </div>

                          <h2 className="fs-6">
                            <Link
                              onClick={() => setSelectedProduct(p)}
                              className="text-inherit text-decoration-none"
                              title={p?.name}
                              style={{
                                display: "inline-block",
                                maxWidth: "100%",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {p?.name}
                            </Link>
                          </h2>

                          {p.rating && (
                            <div>
                              <small className="text-warning">
                                {[...Array(5)].map((_, index) => (
                                  <i
                                    key={index}
                                    className={
                                      index < Math.floor(p.rating)
                                        ? "bi bi-star-fill"
                                        : "bi bi-star"
                                    }
                                  />
                                ))}
                              </small>
                              <span className="text-muted small">
                                {p.rating} {p.reviews && `(${p.reviews})`}
                              </span>
                            </div>
                          )}

                          {/* Description - added back from original */}
                          {p.description && (
                            <p
                              className="text-muted mt-2"
                              style={{
                                height: "30px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 1,
                                whiteSpace: "normal",
                              }}
                              title={p.description}
                            >
                              {p.description}
                            </p>
                          )}

                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <div>
                              <span className="text-danger">Còn hàng</span>
                              {p.originalPrice && (
                                <span className="text-decoration-line-through text-muted ms-2">
                                  {p.originalPrice}
                                </span>
                              )}
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
                  <nav>
                    <ul className="pagination">
                      <li
                        className={`page-item ${page === 1 ? "disabled" : ""}`}
                      >
                        <Link
                          className="page-link mx-1 rounded-3"
                          to="#"
                          onClick={() => handlePageChange(page - 1)}
                          aria-label="Previous"
                        >
                          <i className="fa fa-chevron-left" />
                        </Link>
                      </li>
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <li
                            key={pageNumber}
                            className={`page-item ${
                              page === pageNumber ? "active" : ""
                            }`}
                          >
                            <Link
                              className="page-link mx-1 rounded-3 text-body"
                              to="#"
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </Link>
                          </li>
                        );
                      })}

                      <li
                        className={`page-item ${
                          page === totalPages ? "disabled" : ""
                        }`}
                      >
                        <Link
                          className="page-link mx-1 rounded-3"
                          to="#"
                          onClick={() => handlePageChange(page + 1)}
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
      </section>
    </div>
  );
};

export default SingleShop;
