import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import Swal from "sweetalert2";
import { BASE_URL } from "../../Utils/config";

const ShopWishList = () => {
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [wishItems, setWishItems] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);

    const storedCart = localStorage.getItem("wishList");
    if (storedCart) {
      setWishItems(JSON.parse(storedCart));
    }
  }, []);

  const removeFromWishList = (id) => {
    const updatedWishList = wishItems.filter((item) => item.id !== id);
    setWishItems(updatedWishList);
    localStorage.setItem("wishList", JSON.stringify(updatedWishList));
  };

  const handleAddCart = async () => {
    try {
      // const response = await fetch(
      //   `${BASE_URL}/api/cart/add?shopId=1&productSKUId=1&quantity=1`,
      //   {
      //     method: "POST",
      //     credentials: "include",
      //     headers: { "Content-Type": "application/json" },
      //   }
      // );

      // if (!response.ok)
      //   throw new Error("Không thể thêm sản phẩm vào giỏ hàng.");

      Swal.fire({
        icon: "success",
        title: "Thêm vào giỏ hàng",
        text: "Sản phẩm đã được thêm vào giỏ hàng!",
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
              {/* section */}
              <section className="my-14">
                <div>
                  {/* row */}
                  <div className="row">
                    <div className="offset-lg-1 col-lg-10">
                      <div className="mb-8">
                        {/* heading */}
                        <h1 className="mb-1">Danh sách yêu thích</h1>
                        {wishItems.length > 0 ? (
                          <>
                            {" "}
                            <p>
                              Có {wishItems.length} sản phẩm trong danh sách yêu
                              thích
                            </p>
                            <div>
                              {/* table */}
                              <div className="table-responsive">
                                <table className="table text-nowrap">
                                  <thead className="table-light">
                                    <tr>
                                      <th>
                                        {/* form check */}
                                        <div className="form-check">
                                          <label
                                            className="form-check-label"
                                            htmlFor="chechboxOne"
                                          ></label>
                                        </div>
                                      </th>
                                      <th>Ảnh sản phẩm</th>
                                      <th>Sản phẩm</th>
                                      <th>Mô tả</th>
                                      <th>Thông số</th>
                                      <th>Trạng Thái</th>
                                      <th> </th>
                                      <th> </th>
                                    </tr>
                                  </thead>
                                  {wishItems?.map((item) => (
                                    <tbody>
                                      <tr>
                                        <td className="align-middle">
                                          {/* form check */}
                                          <div className="form-check">
                                            <label
                                              className="form-check-label"
                                              htmlFor="chechboxTwo"
                                            ></label>
                                          </div>
                                        </td>
                                        <td className="align-middle">
                                          <Link to="#">
                                            <img
                                              src={item?.images}
                                              className="img-fluid icon-shape icon-xxl rounded"
                                              alt="product"
                                              style={{
                                                height: "50px",
                                                width: "50px",
                                                objectFit: "cover",
                                              }}
                                            />
                                          </Link>
                                        </td>
                                        <td className="align-middle">
                                          <div>
                                            <h5 className="fs-6 mb-0">
                                              <Link
                                                to="#"
                                                className="text-inherit"
                                              >
                                                {item.name}
                                              </Link>
                                            </h5>
                                          </div>
                                        </td>
                                        <td className="align-middle">
                                          {item?.description?.length > 50
                                            ? item.description.substring(
                                                0,
                                                50
                                              ) + "..."
                                            : item.description}
                                        </td>

                                        <td className="align-middle">
                                          {item?.specifications}
                                        </td>
                                        <td className="align-middle">
                                          <span className="badge bg-success">
                                            Còn hàng
                                          </span>
                                        </td>
                                        {/* <td className="align-middle">
                                          <Link
                                            to={`/Shop/${item.category}`}
                                            className="btn btn-warning btn-sm text-white"
                                          >
                                            Thêm vào giỏ hàng
                                          </Link>
                                        </td> */}
                                        <td className="align-middle text-center">
                                          <div
                                            onClick={() =>
                                              removeFromWishList(item.id)
                                            }
                                            className="btn btn-danger btn-sm"
                                          >
                                            Xóa
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  ))}
                                </table>
                              </div>
                            </div>
                          </>
                        ) : (
                          <span>
                            {" "}
                            Chưa có sản phẩm nào trong danh sách yêu thích.
                          </span>
                        )}
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
export default ShopWishList;
