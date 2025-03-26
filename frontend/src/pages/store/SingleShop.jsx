import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";
import graphics from "../../images/store-graphics.svg";
import { MagnifyingGlass } from "react-loader-spinner";
import Swal from "sweetalert2";
import ScrollToTop from "../ScrollToTop";
import { BASE_URL } from "../../Utils/config";
import image1 from "../../images/glass.jpg";
import ShopProductDetail from "../Shop/ShopProductDetail";

const SingleShop = () => {
  const [stores, setStores] = useState([]);
  const [product, setProduct] = useState([]);
  const [selectedSku, setSelectedSku] = useState(null);
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { shopId } = useParams();

  const storedWishlist = JSON.parse(localStorage.getItem("wishList")) || [];

  useEffect(() => {
    if (!shopId) return;
    const fetchShop = async () => {
      try {
        const shop = await fetch(`${BASE_URL}/api/public/shops/${shopId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!shop.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await shop.json();
        setStores(data);
      } catch (error) {
        console.error("Error fetching shop:", error);
      }
    };
    fetchShop();
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, [shopId]);

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
          `${BASE_URL}/api/cart/add?shopId=${shopId}&productSKUId=${productSKUId}&quantity=${quantity}`,
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
                    <div className="col-12 col-lg-12 col-md-12">
                      <div className="mb-8 bg-light rounded-3 d-lg-flex justify-content-lg-between">
                        <div className="align-self-center p-8">
                          <div className="mb-3">
                            <h5 className="mb-4 fw-bold">{stores?.name}</h5>
                            <span className="fw-bold">
                              Chủ shop: {stores.manager?.name}
                            </span>
                            <br />
                            <span className="text-muted">
                              Email: {stores.manager?.email}
                            </span>
                            <br />
                            <span className="text-primary">
                              Địa chỉ:
                              {stores.address?.address}, {stores.address?.ward},{" "}
                              {stores.address?.district},{" "}
                              {stores.address?.province}
                            </span>
                          </div>
                          <div className="position-relative">
                            <input
                              type="email"
                              className="form-control"
                              id="exampleFormControlInput1"
                              placeholder="Tìm kiếm sản phẩm..."
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

                      {/* row */}
                      {selectedProduct ? (
                        <ShopProductDetail
                          id={selectedProduct.id}
                          onBack={() => setSelectedProduct(null)}
                        />
                      ) : (
                        <>
                          <div className="d-md-flex justify-content-between mb-3 align-items-center">
                            <div>
                              <p className="mb-3 mb-md-0">
                                Có{" "}
                                {
                                  stores.products?.filter((p) => !p.delete)
                                    .length
                                }{" "}
                                sản phẩm
                              </p>
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
                                  <option selected>
                                    {" "}
                                    Sắp xếp theo: Nổi bật{" "}
                                  </option>
                                  <option value="Low to High">
                                    {" "}
                                    Giá: Từ thấp đến cao{" "}
                                  </option>
                                  <option value="High to Low">
                                    {" "}
                                    Giá: Từ cao đến thấp{" "}
                                  </option>
                                  <option value="Release Date">
                                    {" "}
                                    Ngày phát hành{" "}
                                  </option>
                                  <option value="Avg. Rating">
                                    {" "}
                                    Đánh giá trung bình{" "}
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="row g-4 row-cols-xl-5 row-cols-lg-3 row-cols-2 row-cols-md-2 mt-2">
                            {stores?.products
                              ?.filter((p) => !p.delete)
                              ?.map((p, index) => {
                                const isInWishlist = storedWishlist.some(
                                  (item) => item.id === p.id
                                );
                                return (
                                  <div key={index} className="col">
                                    {/* card */}
                                    <div className="card card-product">
                                      <div
                                        className="card-body d-flex flex-column justify-content-between"
                                        style={{ height: "300px" }} // Đảm bảo chiều cao cố định
                                      >
                                        {/* Ảnh - Cố định kích thước */}
                                        <div className="text-center position-relative">
                                          <Link>
                                            <img
                                              src={p.images || image1}
                                              alt={p.images}
                                              className="mb-3 img-fluid"
                                              style={{
                                                width: "150px",
                                                height: "150px",
                                                objectFit: "cover", // Giữ hình ảnh đúng tỉ lệ
                                              }}
                                            />
                                          </Link>
                                          <div className="card-product-action">
                                            <Link
                                              className="btn-action"
                                              onClick={() =>
                                                setSelectedProduct(p)
                                              }
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

                                        {/* Thông tin sản phẩm */}
                                        <div>
                                          <h2
                                            className="fs-6 text-truncate"
                                            style={{
                                              maxWidth: "100%", // Giữ trong vùng hiển thị
                                              whiteSpace: "nowrap",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                            }}
                                          >
                                            <Link
                                              to="#!"
                                              className="text-inherit text-decoration-none"
                                              title={p?.name} // Hiện tooltip khi hover
                                            >
                                              {p?.name}
                                            </Link>
                                          </h2>
                                          <p
                                            className="text-muted"
                                            style={{
                                              height: "40px",
                                              overflow: "hidden",
                                              display: "-webkit-box",
                                              WebkitBoxOrient: "vertical",
                                              WebkitLineClamp: 2,
                                            }}
                                            title={p.description}
                                          >
                                            {p.description}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </>
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
    </div>
  );
};

export default SingleShop;
