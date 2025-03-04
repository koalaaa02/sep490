import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import productimage18 from "../../images/glass.jpg";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";

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
                <div className="container">
                  {/* row */}
                  <div className="row">
                    <div className="offset-lg-1 col-lg-10">
                      <div className="mb-8">
                        {/* heading */}
                        <h1 className="mb-1">Danh sách yêu thích</h1>
                        <p>
                          Có {wishItems.length} sản phẩm trong danh sách yêu
                          thích
                        </p>
                      </div>
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
                                <th />
                                <th>Sản phẩm</th>
                                <th>Thành Tiền</th>
                                <th>Trạng Thái</th>
                                <th> </th>
                                <th> </th>
                              </tr>
                            </thead>
                            {wishItems.map((item) => (
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
                                        src={productimage18}
                                        className="img-fluid icon-shape icon-xxl"
                                        alt="product"
                                      />
                                    </Link>
                                  </td>
                                  <td className="align-middle">
                                    <div>
                                      <h5 className="fs-6 mb-0">
                                        <Link to="#" className="text-inherit">
                                          {item.name}
                                        </Link>
                                      </h5>
                                    </div>
                                  </td>
                                  <td className="align-middle">100.000 VNĐ</td>
                                  <td className="align-middle">
                                    <span className="badge bg-success">
                                      Còn hàng
                                    </span>
                                  </td>
                                  <td className="align-middle">
                                    <div className="btn btn-warning btn-sm">
                                      Thêm vào giỏ hàng
                                    </div>
                                  </td>
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
