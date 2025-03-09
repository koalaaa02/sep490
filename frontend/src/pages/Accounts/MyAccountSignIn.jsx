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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleInputChange = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await fetch(`${BASE_URL}/api/auth/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }
      dispatch(
        loginSuccess({ user: data.user, roles: data.roles, token: data.token })
      );
      navigate("/");
    } catch (err) {
      dispatch(loginFailure(err.message));
      setErrorMessage("Sai tên đăng nhập hoặc mật khẩu");
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
                <h1 className="mb-1 h2 fw-bold">Đăng nhập</h1>
                <p>
                  Chào mừng bạn quay trở lại! Nhập tài khoản của bạn để tiếp
                  tục.
                </p>
              </div>
              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <input
                      className="form-control"
                      placeholder="Tên đăng nhập"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
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
                      <label className="form-check-label" htmlFor="rememberMe">
                        Nhớ tài khoản
                      </label>
                    </div>
                    <div>
                      Quên mật khẩu?{" "}
                      <a href="/MyAccountForgetPassword">Khôi phục ngay</a>
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
                  <div>
                    Chưa có tài khoản? <a href="/MyAccountSignUp">Đăng ký</a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyAccountSignIn;
