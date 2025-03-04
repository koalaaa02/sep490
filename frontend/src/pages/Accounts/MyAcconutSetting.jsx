import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../Utils/config";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/slice/authSlice";
import { useNavigate } from "react-router-dom";

const MyAcconutSetting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/");
  };
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/MyAccountSignIn");
        return;
      }
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

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoaderStatus(false);
      }
    };

    fetchData();
  }, [token]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/myprofile/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
            confirmNewPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Mật khẩu đã được thay đổi thành công.");
      } else {
        setError(data || "Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } catch (err) {
      setError(
        "Không thể kết nối với máy chủ. Vui lòng kiểm tra lại kết nối mạng."
      );
    }
  };

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
                    <h3 className="fs-5 mb-0">Tài khoản</h3>
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
                        <button className="nav-link " onClick={handleLogOut}>
                          <i className="fas fa-sign-out-alt me-2" />
                          Đăng Xuất
                        </button>
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
                            {message && (
                              <div className="alert alert-success">
                                {message}
                              </div>
                            )}
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
                                      placeholder={userData.name}
                                      disabled
                                    />
                                  </div>
                                  {/* input */}
                                  <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                      type="email"
                                      className="form-control"
                                      placeholder={userData?.email}
                                      disabled
                                    />
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                          <hr className="my-5" />
                          <div className="pe-lg-14">
                            {/* heading */}
                            <h5 className="mb-4">Mật khẩu</h5>
                            <form onSubmit={handleChangePassword}>
                              <div className="mb-3">
                                <label className="form-label">
                                  Mật khẩu hiện tại
                                </label>
                                <input
                                  type="password"
                                  className="form-control"
                                  placeholder="Nhập mật khẩu hiện tại"
                                  required
                                  value={oldPassword}
                                  onChange={(e) =>
                                    setOldPassword(e.target.value)
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">
                                  Mật khẩu mới
                                </label>
                                <input
                                  type="password"
                                  className="form-control"
                                  placeholder="Nhập mật khẩu mới"
                                  required
                                  value={newPassword}
                                  onChange={(e) =>
                                    setNewPassword(e.target.value)
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">
                                  Xác nhận mật khẩu mới
                                </label>
                                <input
                                  type="password"
                                  className="form-control"
                                  placeholder="Nhập lại mật khẩu mới"
                                  required
                                  value={confirmNewPassword}
                                  onChange={(e) =>
                                    setConfirmNewPassword(e.target.value)
                                  }
                                />
                              </div>
                              <button type="submit" className="btn btn-warning">
                                Đổi mật khẩu
                              </button>
                            </form>
                          </div>
                          <hr className="my-5" />
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
        </div>
      </>
    </div>
  );
};

export default MyAcconutSetting;
