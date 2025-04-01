import React, { useState } from "react";
import signupimage from "../../images/signup-g.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import { BASE_URL } from "../../Utils/config";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const MyAccountSignUp = () => {
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isActivate, setIsActivate] = useState(false);
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const handleInputChange = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const fullName = `${firstName}${lastName}`.trim();

    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: fullName, email, password }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        data = { message: text };
      }

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      setIsActivate(true);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
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
        body: JSON.stringify({ email, resetToken: otp }),
      });

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data.message || "Kích hoạt thất bại");
      }

      setSuccessMessage(
        "Kích hoạt tài khoản thành công, vui lòng đăng nhập lại!"
      );

      setIsActivate(false);

      navigate("/MyAccountOrder");
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
              <img src={signupimage} alt="Đăng ký" className="img-fluid" />
            </div>
            <div className="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1">
              <div className="mb-lg-9 mb-5">
                <h1 className="mb-1 h2 fw-bold">
                  {isActivate ? "Kích hoạt tài khoản" : "Bắt đầu mua sắm"}
                </h1>
                <p>
                  {isActivate
                    ? "Nhập email và mã kích hoạt của bạn để kích hoạt tài khoản."
                    : " Chào mừng bạn đến với Build Mark! Đăng ký tài khoản của bạn để bắt đầu."}
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
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value);
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
                // Form đăng ký
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Họ"
                        aria-label="Họ"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value.trim())}
                        required
                      />
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tên"
                        aria-label="Tên"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value.trim())}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    <div className="col-12 d-grid">
                      <button
                        type="submit"
                        className="btn btn-warning"
                        disabled={loading}
                      >
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                      </button>
                      <span className="navbar-text">
                        Bạn đã có tài khoản?{" "}
                        <Link
                          className="text-warning text-decoration-none"
                          to="/MyAccountSignIn"
                        >
                          Đăng nhập
                        </Link>
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

export default MyAccountSignUp;
