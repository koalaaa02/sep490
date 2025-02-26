import React from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import amazonpay from "../images/amazonpay.svg";
import american from "../images/american-express.svg";
import mastercard from "../images/mastercard.svg";
import paypal from "../images/paypal.svg";
import visa from "../images/visa.svg";

const Footer = () => {
  return (
    <div>
      <>
        <footer className="footer mt-8">
          <div className="overlay" />
          <div className="container">
            <div className="row footer-row">
              <div className="col-sm-6 col-lg-3 mb-30">
                <div className="footer-widget">
                  <div className="footer-logo"></div>
                  <p className="mb-30">
                    Chúng tôi mang đến nhiều hơn sự mong đợi của bạn và giúp bạn
                    phát triển doanh nghiệp một cách vượt bậc bằng cách cung cấp
                    các ứng dụng tùy chỉnh. Vì vậy, đừng chỉ nghĩ, hãy sẵn sàng
                    biến ý tưởng của bạn thành hiện thực.
                  </p>
                </div>
                <div className="dimc-protect">
                  <div className="col-lg-12 text-lg-start text-center mb-2 mb-lg-0">
                    <h4>Phương thức thanh toán</h4>
                    <ul className="list-inline d-flex mb-0">
                      <li className="list-inline-item">
                        <Link to="#">
                          <img src={amazonpay} alt="amazonpay" />
                        </Link>
                      </li>
                      <li className="list-inline-item">
                        <Link to="#">
                          <img src={american} alt="american-express" />
                        </Link>
                      </li>
                      <li className="list-inline-item">
                        <Link to="#">
                          <img src={mastercard} alt="mastercard" />
                        </Link>
                      </li>
                      <li className="list-inline-item">
                        <Link to="#">
                          <img src={paypal} alt="paypal" />
                        </Link>
                      </li>
                      <li className="list-inline-item">
                        <Link to="#">
                          <img src={visa} alt="visa" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 mb-30">
                <div className="footer-widget mb-0">
                  <h4>Dành cho khách hàng</h4>
                  <div className="line-footer" />
                  <div className="row">
                    <div className="col">
                      <ul className="footer-link mb-0">
                        <li>
                          <Link to="#">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span> Tuyển dụng
                          </Link>
                        </li>
                        <li>
                          <Link to="/ShopCart">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span> Khuyến mãi & Mã giảm giá
                          </Link>
                        </li>
                        <li>
                          <Link to="/MyAccountOrder">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span> Vận chuyển
                          </Link>
                        </li>
                        <li>
                          <Link to="/MyAccountOrder">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span> Trả hàng
                          </Link>
                        </li>
                        <li>
                          <Link to="/MyAcconutPaymentMethod">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span> Thanh toán
                          </Link>
                        </li>
                        <li>
                          <Link to="/Contact">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span> Câu hỏi thường gặp
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 mb-30">
                <div className="footer-widget mb-0">
                  <h4>Về chúng tôi</h4>
                  <div className="line-footer" />
                  <div className="row">
                    <div className="col">
                      <ul className="footer-link mb-0">
                        <li>
                          <Link to="/AboutUs">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span> Công ty
                          </Link>
                        </li>
                        <li>
                          <Link to="/AboutUs">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span> Giới thiệu
                          </Link>
                        </li>
                        <li>
                          <Link to="/Blog">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span> Blog
                          </Link>
                        </li>
                        <li>
                          <Link to="/Contact">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span> Trung tâm hỗ trợ
                          </Link>
                        </li>
                        <li>
                          <Link to="/Blog">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span> Giá trị cốt lõi
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="footer-widget mt-8">
                  <div className="newsletter-item">
                    <input
                      type="email"
                      id="email"
                      placeholder="Nhập email của bạn"
                      className="form-control form-control-lg"
                      required
                    />
                    <button type="submit">
                      <i className="fa fa-paper-plane" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </>
    </div>
  );
};

export default Footer;