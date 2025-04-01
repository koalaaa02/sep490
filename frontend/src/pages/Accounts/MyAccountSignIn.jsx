import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../Redux/slice/authSlice.js";
import signinimage from "../../images/signin-g.svg";
import ScrollToTop from "../ScrollToTop";
import { BASE_URL } from "../../Utils/config";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const MyAccountSignIn = () => {
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );
  const [password, setPassword] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // State để chuyển đổi giữa form đăng nhập và form kích hoạt
  const [isActivate, setIsActivate] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleInputChange = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmitSignIn = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await fetch(`${BASE_URL}/api/auth/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      dispatch(loginSuccess({ user: data, token: data.token }));
      navigate("/");
    } catch (err) {
      dispatch(loginFailure(err.message));
      setErrorMessage("Sai email, mật khẩu hoặc tài khoản của bạn chưa được kích hoạt");
    }
  };

  const handleSubmitActivate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/auth/activate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, resetToken: activationCode }),
      });

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data.message || "Kích hoạt thất bại");
      }

      setSuccessMessage(
        "Kích hoạt tài khoản thành công, vui lòng đăng nhập lại!"
      );

      setIsActivate(false);
    } catch (err) {
      setErrorMessage("Kích hoạt thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div>
      <ScrollToTop />
      <section className="my-lg-14 my-8">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
              <img src={signinimage} alt="Đăng nhập" className="img-fluid" />
            </div>
            <div className="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1">
              <div className="mb-lg-9 mb-5">
                <h1 className="mb-1 h2 fw-bold">
                  {isActivate ? "Kích hoạt tài khoản" : "Đăng nhập"}
                </h1>
                <p>
                  {isActivate
                    ? "Nhập email và mã kích hoạt của bạn để kích hoạt tài khoản."
                    : "Chào mừng bạn quay trở lại! Nhập tài khoản của bạn để tiếp tục."}
                </p>
              </div>
              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}
              {isActivate ? (
                // Form kích hoạt tài khoản
                <form onSubmit={handleSubmitActivate}>
                  <div className="row g-3">
                    <div className="col-12">
                      <input
                        className="form-control"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          handleInputChange();
                        }}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <input
                        className="form-control"
                        placeholder="Mã kích hoạt"
                        type="text"
                        value={activationCode}
                        onChange={(e) => {
                          setActivationCode(e.target.value);
                          handleInputChange();
                        }}
                        required
                      />
                    </div>
                    <div className="col-12 d-grid">
                      <button type="submit" className="btn btn-warning">
                        Kích hoạt
                      </button>
                    </div>
                    <div className="mt-2">
                      Đã có tài khoản?{" "}
                      <span
                        onClick={() => {
                          setIsActivate(false);
                          setErrorMessage("");
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                        className="text-warning"
                      >
                        Đăng nhập
                      </span>
                    </div>
                  </div>
                </form>
              ) : (
                // Form đăng nhập
                <form onSubmit={handleSubmitSignIn}>
                  <div className="row g-3">
                    <div className="col-12">
                      <input
                        className="form-control"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          handleInputChange();
                        }}
                        required
                      />
                    </div>
                    <div className="col-12 position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          handleInputChange();
                        }}
                        required
                      />
                      <span
                        className="position-absolute top-50 end-0 translate-middle-y me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="rememberMe"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="rememberMe"
                        >
                          Nhớ tài khoản
                        </label>
                      </div>
                      <div>
                        Quên mật khẩu?{" "}
                        <a
                          href="/MyAccountForgetPassword"
                          className="text-decoration-none text-warning"
                        >
                          Khôi phục ngay
                        </a>
                      </div>
                    </div>
                    <div className="col-12 d-grid">
                      <button
                        type="submit"
                        className="btn btn-warning"
                        disabled={loading}
                      >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                      </button>
                    </div>
                    <div className="mt-2">
                      Chưa có tài khoản?{" "}
                      <a
                        href="/MyAccountSignUp"
                        className="text-decoration-none text-warning"
                      >
                        Đăng ký
                      </a>
                    </div>
                    <div className="mt-2">
                      Tài khoản của bạn chưa được kích hoạt?{" "}
                      <span
                        onClick={() => {
                          setIsActivate(true);
                          setErrorMessage("");
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                        className="text-warning"
                      >
                        Kích hoạt
                      </span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyAccountSignIn;
