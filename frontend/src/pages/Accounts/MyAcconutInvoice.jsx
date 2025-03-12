import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import MyAccountInvoiceDetail from "./MyAccountInvoiceDetail";
import { BASE_URL } from "../../Utils/config";

const MyAcconutInvoice = () => {
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  const token = localStorage.getItem("access_token");
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: 1,
          size: 10,
          sortBy: "id",
          direction: "ASC",
          shopId: 1,
          deliveryCode: "string",
          deliveryMethod: "GHN",
          paymentMethod: "COD",
          status: "PENDING",
          paid: false,
        });

        const response = await fetch(
          // `${BASE_URL}/api/invoice/?${params.toString()}`,
          `${BASE_URL}/api/invoice/1`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchData();
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/");
  };

  const invoices = [
    {
      id: 1,
      customer: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      date: "11/03/2025",
      total: 550000,
      items: [
        { name: "Dầu gội dưỡng tóc", quantity: 2, price: 150000 },
        { name: "Serum dưỡng tóc", quantity: 1, price: 250000 },
      ],
    },
    {
      id: 2,
      customer: "Trần Thị B",
      email: "tranthib@example.com",
      date: "12/03/2025",
      total: 320000,
      items: [{ name: "Kem dưỡng tóc", quantity: 1, price: 320000 }],
    },
  ];

  return (
    <div>
      <>
        <ScrollToTop />
      </>
      <>
        {/* section */}
        <section>
          {/* container */}
          <div className="container">
            {/* row */}
            <div className="row">
              {/* col */}
              <div className="col-12">
                {/* text */}
                <div className="mt-10 d-flex justify-content-between align-items-center d-md-none">
                  {/* heading */}
                  <h3 className="fs-5 mb-0">Tài khoản</h3>
                </div>
              </div>
              {/* col */}
              <div className="col-lg-3 col-md-4 col-12 border-end  d-none d-md-block">
                <div className="pt-10 pe-lg-10">
                  {/* nav */}
                  <ul className="nav flex-column nav-pills nav-pills-dark">
                    {/* nav item */}
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        aria-current="page"
                        to="/MyAccountOrder"
                      >
                        <i className="fas fa-shopping-bag me-2" />
                        Đơn đặt hàng của bạn
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/MyAccountSetting">
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
                      <Link
                        className="nav-link active"
                        to="/MyAcconutNotification"
                      >
                        <i className="fas fa-bell me-2" />
                        Hóa đơn của tôi
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
                      <div className="col-md-12">
                        <div className="mb-6">
                          {/* heading */}
                          <h3 className="mb-0 mt-5">Hóa đơn</h3>
                        </div>
                        {selectedInvoice ? (
                          <MyAccountInvoiceDetail
                            id={selectedInvoice.id}
                            onBack={() => setSelectedInvoice(null)}
                          />
                        ) : (
                          <div>
                            <table className="table table-hover">
                              <thead className="table-light text-center">
                                <tr>
                                  <th className="py-3">Mã hóa đơn</th>
                                  <th className="py-3">Khách hàng</th>
                                  <th className="py-3">Email</th>
                                  <th className="py-3">Ngày</th>
                                  <th className="py-3">Trạng thái</th>
                                  <th className="text-end py-3">Tổng</th>
                                </tr>
                              </thead>
                              <tbody>
                                {invoices.map((invoice) => (
                                  <tr
                                    key={invoice.id}
                                    onClick={() => setSelectedInvoice(invoice)}
                                  >
                                    <td className="py-3 text-center">
                                      {invoice.id}
                                    </td>
                                    <td className="py-3">{invoice.customer}</td>
                                    <td className="py-3">{invoice.email}</td>
                                    <td className="py-3 text-center">
                                      {invoice.date}
                                    </td>
                                    <td className="py-3 text-center">
                                      <span className="px-3 py-1 bg-warning text-dark rounded">
                                        Chưa thanh toán
                                      </span>
                                    </td>
                                    <td className="text-end py-3">
                                      {invoice.total.toLocaleString()} đ
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </div>
  );
};

export default MyAcconutInvoice;
