import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Utils/config";
import MyAccountSideBar from "../../Component/MyAccountSideBar/MyAccountSideBar";
import OrderStatus from "../../Component/Order/OrderStatus/OrderStatus";
import OrderList from "../../Component/Order/OrderDetail/OrderList";
const MyAccountOrder = () => {
  const token = localStorage.getItem("access_token");
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("PENDING");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/");
  };
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: 1,
          size: 100,
          sortBy: "id",
          direction: "ASC",
          paid: false,
        });
        const response = await fetch(
          `${BASE_URL}/api/dealer/orders?${params.toString()}`,
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
  }, [status]);

  const orders = data?.content
    ?.map((order) => ({
      shopName: order?.shop.name,
      id: order?.id,

      status: order?.status,
      products: order?.orderDetails?.map((detail) => ({
        price: detail?.price,
        quantity: detail?.quantity,
        image: detail?.productSku?.images,
        productName: "BACKEND DEO TRA PRODUCT NAME",
      })),
    }))
    .filter((f) => f.status === status);

  return (
    <div>
      <>
        <ScrollToTop />
      </>
      <>
        <section>
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-4 col-12 border-end  d-none d-md-block">
                <div className="mt-5 d-flex justify-content-between align-items-center d-md-none">
                  {/* heading */}
                  <h3 className="fs-5 mb-0">Tài khoản</h3>
                </div>
              </div>

              <div className="d-flex">
                <MyAccountSideBar activeKey={"MyAccountOrder"} />

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
                        <div className="w-100">
                          <OrderStatus setStatus={setStatus} />
                          <OrderList orders={orders} status={status} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </div>
  );
};

export default MyAccountOrder;
