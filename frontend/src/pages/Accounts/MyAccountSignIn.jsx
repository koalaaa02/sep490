import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { loginStart, loginSuccess, loginFailure } from "../../Redux/slice/authSlice.js"; 
import signinimage from "../../images/signin-g.svg";
import ScrollToTop from "../ScrollToTop";
import { BASE_URL } from "../../Utils/config";

const MyAccountSignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth); // Lấy trạng thái từ Redux

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart()); // Bắt đầu trạng thái loading

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
        throw new Error(data.message || "Login failed");
      }

      dispatch(loginSuccess({ user: data.user, token: data.token })); // Lưu vào Redux
      navigate("/");
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  return (
    <div>
      <ScrollToTop />
      <section className="my-lg-14 my-8">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
              <img src={signinimage} alt="signin" className="img-fluid" />
            </div>
            <div className="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1">
              <div className="mb-lg-9 mb-5">
                <h1 className="mb-1 h2 fw-bold">Sign in</h1>
                <p>Welcome back! Enter your email to get started.</p>
              </div>
              {error && <div className="alert alert-danger">Wrong Username or Password</div>}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <input
                      className="form-control"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-between">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="rememberMe" />
                      <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                    </div>
                    <div>
                      Forgot password? <a href="/MyAccountForgetPassword">Reset it</a>
                    </div>
                  </div>
                  <div className="col-12 d-grid">
                    <button type="submit" className="btn btn-warning" disabled={loading}>
                      {loading ? "Signing In..." : "Sign In"}
                    </button>
                  </div>
                  <div>
                    Don’t have an account? <a href="/MyAccountSignUp">Sign Up</a>
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
