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
import Product from "../../Component/Public/Product";

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
  useEffect(() => {
    const fetchData = async () => {
      if (!cateId) return;
      try {
        const response = await fetch(
          `${BASE_URL}/api/public/categories/${cateId}`,
          {
            method: "GET",
            headers: {
              // Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const result = await response.json();

        setCategories(result);
        setLoaderStatus(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [cateId]);
  console.log(categories);

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

  const totalPages = Math.ceil(products.totalElements / size);

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
                    {/* price */}
                    <h5 className="mb-3">Danh mục con</h5>
                    <div>
                      {categories?.subCategories?.length ? (
                        categories.subCategories.map((c) => (
                          <Link
                            key={c.id} // Don't forget to add a unique key for each item
                            to={`/shop/${c.id}`}
                            className="text-decoration-none text-black hover:text-primary"
                          >
                            <p className="mb-2">{c.name}</p>
                          </Link>
                        ))
                      ) : (
                        <p className="text-muted">Không có danh mục con</p>
                      )}
                    </div>
                  </div>
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
                              categories?.products?.filter((p) => !p.delete)
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
                      {categories?.products?.filter((p) => !p.delete).length >
                      0 ? (
                        categories.products
                          .filter((p) => !p.delete)
                          .map((p, index) => {
                            const isInWishlist = storedWishlist.some(
                              (item) => item.id === p.id
                            );
                            return (
                              <div key={index} className="col">
                                {/* card */}
                                <Product product={p} />
                              </div>
                            );
                          })
                      ) : (
                        <div className="col-12">
                          <p>No items found</p>
                        </div>
                      )}
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
