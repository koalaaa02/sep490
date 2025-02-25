import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../Utils/config";

const MyAcconutSetting = () => {
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/myprofile/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const textData = await response.text();
        console.log("Data:", textData);
        console.log("Text Data Length:", textData.length);
        const dataJoson = JSON.parse(textData); 
        console.log("Parsed Data:", dataJoson);
        setUserData(textData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoaderStatus(false);
      }
    };

    fetchData();
  }, [token]);

  // console.log(userData);

  return (
    <div>
      <>
        <ScrollToTop />
      </>
      <>
        <div>
          {/* section */}
          <section>
            {/* container */}
            <div className="container">
              {/* row */}
              <div className="row">
                {/* col */}
                <div className="col-12">
                  <div className="mt-10 d-flex justify-content-between align-items-center d-md-none">
                    {/* heading */}
                    <h3 className="fs-5 mb-0">Cài đặt tài khoản</h3>
                    {/* btn */}
                    <button
                      className="btn btn-outline-gray-400 text-muted d-md-none"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasAccount"
                      aria-controls="offcanvasAccount"
                    >
                      <i className="fas fa-bars"></i>
                    </button>
                  </div>
                </div>
                {/* col */}
                <div className="col-lg-3 col-md-4 col-12 border-end  d-none d-md-block">
                  <div className="pt-10 pe-lg-10">
                    {/* nav item */}
                    <ul className="nav flex-column nav-pills nav-pills-dark">
                      <li className="nav-item">
                        <Link
                          className="nav-link "
                          aria-current="page"
                          to="/MyAccountOrder"
                        >
                          <i className="fas fa-shopping-bag me-2" />
                          Đơn đặt hàng của bạn
                        </Link>
                      </li>
                      {/* nav item */}
                      <li className="nav-item">
                        <Link
                          className="nav-link active"
                          to="/MyAccountSetting"
                        >
                          <i className="fas fa-cog me-2" />
                          Cài đặt
                        </Link>
                      </li>
                      {/* nav item */}
                      <li className="nav-item">
                        <Link className="nav-link" to="/MyAccountAddress">
                          <i className="fas fa-map-marker-alt me-2" />
                          Địa chỉ
                        </Link>
                      </li>
                      {/* nav item */}
                      <li className="nav-item">
                        <Link className="nav-link" to="/MyAcconutPaymentMethod">
                          <i className="fas fa-credit-card me-2" />
                          Phương thức thanh toán
                        </Link>
                      </li>
                      {/* nav item */}
                      <li className="nav-item">
                        <Link className="nav-link" to="/MyAcconutNotification">
                          <i className="fas fa-bell me-2" />
                          Thông báo
                        </Link>
                      </li>
                      {/* nav item */}
                      <li className="nav-item">
                        <hr />
                      </li>
                      {/* nav item */}
                      <li className="nav-item">
                        <Link className="nav-link " to="/">
                          <i className="fas fa-sign-out-alt me-2" />
                          Log out
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-9 col-md-8 col-12">
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
                        <div className="p-6 p-lg-10">
                          <div className="mb-6">
                            {/* heading */}
                            <h2 className="mb-0">Cài đặt tài khoản</h2>
                          </div>
                          <div>
                            {/* heading */}
                            <h5 className="mb-4">Thông tin cá nhân</h5>
                            <div className="row">
                              <div className="col-lg-5">
                                {/* form */}
                                <form>
                                  {/* input */}
                                  <div className="mb-3">
                                    <label className="form-label">Tên</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Nigam Mishra"
                                    />
                                  </div>
                                  {/* input */}
                                  <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                      type="email"
                                      className="form-control"
                                      placeholder="example@gmail.com"
                                    />
                                  </div>
                                  {/* input */}
                                  <div className="mb-5">
                                    <label className="form-label">
                                      Số điện thoại
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Phone number"
                                    />
                                  </div>
                                  {/* button */}
                                  <div className="mb-3">
                                    <button className="btn btn-warning">
                                      Lưu
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                          <hr className="my-10" />
                          <div className="pe-lg-14">
                            {/* heading */}
                            <h5 className="mb-4">Mật khẩu</h5>
                            <form className=" row row-cols-1 row-cols-lg-2">
                              {/* input */}
                              <div className="mb-3 col">
                                <label className="form-label">
                                  Mật khẩu cũ
                                </label>
                                <input
                                  type="password"
                                  className="form-control"
                                  placeholder="**********"
                                />
                              </div>
                              {/* input */}
                              <div className="mb-3 col">
                                <label className="form-label">
                                  Mật khẩu mới
                                </label>
                                <input
                                  type="password"
                                  className="form-control"
                                  placeholder="**********"
                                />
                              </div>
                              {/* input */}
                              <div className="col-12">
                                <p className="mb-4">
                                  Không thể nhớ mật khẩu hiện tại của bạn?
                                  <Link to="/MyAccountForgetPassword">
                                    {" "}
                                    Đặt lại mật khẩu của bạn.
                                  </Link>
                                </p>
                                <Link to="#" className="btn btn-warning">
                                  Lưu mật khẩu
                                </Link>
                              </div>
                            </form>
                          </div>
                          <hr className="my-10" />
                          <div>
                            {/* heading */}
                            <h5 className="mb-4">Xóa tài khoản</h5>
                            <p className="mb-2">
                              Bạn có muốn xóa tài khoản của mình không?
                            </p>
                            <p className="mb-5">
                              Xóa tài khoản sẽ xóa tất cả các chi tiết đặt hàng
                              liên kết với nó.
                            </p>
                            {/* btn */}
                            <Link to="#" className="btn btn-outline-danger">
                              Tôi muốn xóa tài khoản của mình
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* modal */}
          <div
            className="offcanvas offcanvas-start"
            tabIndex={-1}
            id="offcanvasAccount"
            aria-labelledby="offcanvasAccountLabel"
          >
            {/* offcanvas header */}
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasAccountLabel">
                My Account
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
            {/* offcanvas body */}
            <div className="offcanvas-body">
              <ul className="nav flex-column nav-pills nav-pills-dark">
                {/* nav item */}
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    aria-current="page"
                    href="/MyAccountOrder"
                  >
                    <i className="fas fa-shopping-bag me-2" />
                    Your Orders
                  </a>
                </li>
                {/* nav item */}
                <li className="nav-item">
                  <a className="nav-link " href="/MyAccountSetting">
                    <i className="fas fa-cog me-2" />
                    Settings
                  </a>
                </li>
                {/* nav item */}
                <li className="nav-item">
                  <a className="nav-link" href="/MyAccountAddress">
                    <i className="fas fa-map-marker-alt me-2" />
                    Address
                  </a>
                </li>
                {/* nav item */}
                <li className="nav-item">
                  <a className="nav-link" href="/MyAcconutPaymentMethod">
                    <i className="fas fa-credit-card me-2" />
                    Payment Method
                  </a>
                </li>
                {/* nav item */}
                <li className="nav-item">
                  <a className="nav-link" href="/MyAcconutNotification">
                    <i className="fas fa-bell me-2" />
                    Notification
                  </a>
                </li>
              </ul>
              <hr className="my-6" />
              <div>
                {/* nav  */}
                <ul className="nav flex-column nav-pills nav-pills-dark">
                  {/* nav item */}
                  <li className="nav-item">
                    <a className="nav-link " href="/">
                      <i className="fas fa-sign-out-alt me-2" />
                      Log out
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default MyAcconutSetting;
