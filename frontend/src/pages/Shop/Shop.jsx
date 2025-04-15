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
import { FaSearch } from "react-icons/fa";

function Dropdown() {
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { cateId } = useParams();
  const storedWishlist = JSON.parse(localStorage.getItem("wishList")) || [];
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [direction, setDirection] = useState("ASC");
  const [searchName, setSearchName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const params1 = new URLSearchParams({
    page: page,
    size: size,
    sortBy: "id",
    direction: direction,
    active: true,
    categoryId: cateId,
    name: searchQuery,
  });

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

        const [shopResponse, cateResponse, proResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/public/shops?${params.toString()}`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${BASE_URL}/api/public/categories/${cateId}`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${BASE_URL}/api/public/products?${params1.toString()}`, {
            method: "GET",
            credentials: "include",
          }),
        ]);

        if (shopResponse.ok && cateResponse.ok && proResponse.ok) {
          const [shopData, cateData, proData] = await Promise.all([
            shopResponse.json(),
            cateResponse.json(),
            proResponse.json(),
          ]);
          setStores(shopData.content || []);
          setCategories(cateData || {});
          setProducts(proData || {});
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
  }, [cateId, size, page, direction, searchQuery]);

  const handleChange = (event) => {
    setSize(event.target.value);
  };

  const handleChangeDirection = (event) => {
    setDirection(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
  };

  const handleSearchClick = () => {
    setSearchQuery(searchName); // Cập nhật giá trị tìm kiếm
  };

  const totalPages = Math.ceil(products?.totalElements / size);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
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
                    <h5 className="mb-3">Danh sách nhà cung cấp</h5>
                    <div className="my-4">
                      {/* input */}
                      <input
                        type="search"
                        className="form-control"
                        placeholder="Tìm kiếm nhà cung cấp..."
                      />
                    </div>
                    {stores?.length > 0 ? (
                      stores.map((stores, index) => (
                        <div className="form-check mb-2" key={index}>
                          {/* input */}
                          <Link
                            to={`/SingleShop/${stores.id}`}
                            className="form-check-label text-decoration-none text-warning"
                            htmlFor="eGrocery"
                          >
                            {stores.name}
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
                    <h5 className="mb-3">{categories?.name}</h5>
                    <div>
                      {categories?.subCategories.length > 0 ? (
                        categories?.subCategories.map((cate, index) => (
                          <div className="form-check mb-2" key={index}>
                            {/* input */}
                            <Link
                              to={`/shop/${cate.id}`}
                              className="form-check-label text-decoration-none text-warning"
                              htmlFor="eGrocery"
                            >
                              {cate.name}
                            </Link>
                          </div>
                        ))
                      ) : (
                        <p className="dropdown-item">Không có</p>
                      )}
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
                  <div className=" card-body p-4">
                    <div style={{ position: "relative", width: "35%" }}>
                      <input
                        className="form-control responsivesearch"
                        list="datalistOptions"
                        id="exampleDataList"
                        placeholder={`Tìm kiếm trong ${categories.name}...`}
                        value={searchName}
                        onChange={handleSearchChange}
                        style={{ paddingRight: "35px" }} // Chừa chỗ cho icon bên phải
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
                            Có{" "}
                            {
                              categories.products?.filter((p) => !p.delete)
                                .length
                            }{" "}
                          </span>{" "}
                          sản phẩm{" "}
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
                      {products.content
                        .filter((p) => !p.delete)
                        .map((p, index) => {
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
                                        <i
                                          className="bi bi-eye"
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
                                          isInWishlist
                                            ? "disabled text-warning"
                                            : ""
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
                                        {p.rating}{" "}
                                        {p.reviews && `(${p.reviews})`}
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
                                      <span className="text-danger">
                                        Còn hàng
                                      </span>
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
                            {/* Nút Previous */}
                            <li
                              className={`page-item ${
                                page === 1 ? "disabled" : ""
                              }`}
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

                            {/* Hiển thị số trang */}
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

                            {/* Nút Next */}
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dropdown;
