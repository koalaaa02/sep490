import React, { useState } from "react";
import forgetpassword from "../../images/fp-g.svg";
import { Link } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import { BASE_URL } from "../../Utils/config";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const MyAccountForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("email");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.text();

      if (response.ok) {
        setMessage(
          "Mã đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư của bạn."
        );
        setStep("otp");
      } else {
        setError("Email của bạn không tồn tại. Vui lòng thử lại.");
      }
    } catch (err) {
      setError(
        "Không thể kết nối với máy chủ. Vui lòng kiểm tra lại kết nối mạng."
      );
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/auth/forgot-password/change`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            resetToken: otp,
            newPassword,
            confirmNewPassword: newPassword,
          }),
        }
      );

      const data = await response.text();

      if (response.ok) {
        setMessage(
          "Mật khẩu đã được thay đổi thành công. Bạn có thể đăng nhập ngay bây giờ."
        );
        setStep("success");
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
      <ScrollToTop />
      <section className="my-lg-14 my-8">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
              <img src={forgetpassword} alt="freshcart" className="img-fluid" />
            </div>
            <div className="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1 d-flex align-items-center">
              <div>
                <h1 className="mb-2 h2 fw-bold">Quên mật khẩu ?</h1>
                {message && (
                  <div className="alert alert-success">{message}</div>
                )}
                {error && <div className="alert alert-danger">{error}</div>}
                {step === "email" && (
                  <form onSubmit={handleSubmitEmail}>
                    <p>
                      Nhập email và chúng tôi sẽ gửi một liên kết đặt lại mật
                      khẩu.
                    </p>
                    <div className="row g-3">
                      <div className="col-12">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <span className="navbar-text">
                          Đã có tài khoản?
                          <Link
                            to="/MyAccountSignIn"
                            className="text-warning m-2 text-decoration-none"
                          >
                            Đăng nhập
                          </Link>
                        </span>
                      </div>
                      <div className="col-12 d-grid gap-2">
                        <button type="submit" className="btn btn-warning">
                          Gửi mã
                        </button>
                        <Link to="/" className="btn btn-light">
                          Quay lại
                        </Link>
                      </div>
                    </div>
                  </form>
                )}
                {step === "otp" && (
                  <form onSubmit={handleSubmitOtp}>
                    <p>Nhập mã OTP và tạo mật khẩu mới.</p>
                    <div className="row g-3">
                      <div className="col-12">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Mã OTP"
                          required
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Mật khẩu mới"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <span
                          className="position-absolute top-50 end-0 translate-middle-y me-3"
                          style={{ cursor: "pointer" }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                      <div className="col-12">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Nhập lại mật khẩu mới"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <div className="col-12 d-grid gap-2">
                        <button type="submit" className="btn btn-warning">
                          Xác nhận
                        </button>
                      </div>
                    </div>
                  </form>
                )}
                {step === "success" && (
                  <div>
                    <p>
                      Mật khẩu đã được thay đổi thành công. Hãy đăng nhập bằng
                      mật khẩu mới của bạn.
                    </p>
                    <Link to="/MyAccountSignIn" className="btn btn-warning">
                      Đăng nhập
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyAccountForgetPassword;
