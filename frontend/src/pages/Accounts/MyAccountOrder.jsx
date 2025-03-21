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
import cement from "../../images/cement.jpg";
import bricks from "../../images/bricks.jpg";
import sand from "../../images/sand.jpg";
import steel from "../../images/steel.jpg";
import tiles from "../../images/tiles.png";
import wood from "../../images/wood.jpg";
const MyAccountOrder = () => {
  const token = localStorage.getItem("access_token");
  const [data, setData] = useState(null);
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
          size: 10,
          sortBy: "id",
          direction: "ASC",
        });
        console.log(`${BASE_URL}/api/dealer/orders?${params.toString()}`);

        const response = await fetch(
          `${BASE_URL}/api/dealer/orders?${params.toString()}`,
          // `${BASE_URL}/api/orders/1`,
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
  // console.log(data);

  // const [expandedRows, setExpandedRows] = useState({});

  // const toggleRow = (index) => {
  //   setExpandedRows((prev) => ({
  //     ...prev,
  //     [index]: !prev[index],
  //   }));
  // };
  const orders = [
    {
      id: "1",
      name: "Xây nhà",
      date: "March 5, 2025",
      status: "Processing",
      badgeClass: "bg-warning",
      products: [
        {
          id: 1,
          name: "Xi măng",
          quantity: 10,
          price: 90000,
          src: cement,
          alt: "cement",
        },
        {
          id: 2,
          name: "Cát",
          quantity: 10,
          price: 15000,
          src: sand,
          alt: "sand",
        },
        {
          id: 3,
          name: "Gạch",
          quantity: 10,
          price: 15000,
          src: bricks,
          alt: "bricks",
        },
      ],
    },
    {
      id: "2",
      name: "Làm sân",
      date: "March 5, 2025",
      status: "Accepted",
      badgeClass: "bg-warning",
      products: [
        {
          id: 1,
          name: "Thép",
          quantity: 10,
          price: 90000,
          src: steel,
          alt: "steel",
        },
        {
          id: 2,
          name: "gạch ốp",
          quantity: 10,
          price: 15000,
          src: tiles,
          alt: "tiles",
        },
        {
          id: 3,
          name: "gỗ",
          quantity: 10,
          price: 15000,
          src: wood,
          alt: "wood",
        },
      ],
    },
    {
      id: "3",
      name: "Làm sân 2",
      date: "March 5, 2025",
      status: "Completed",
      badgeClass: "bg-warning",
      products: [
        {
          id: 1,
          name: "Thép",
          quantity: 10,
          price: 90000,
          src: steel,
          alt: "steel",
        },
        {
          id: 2,
          name: "gạch ốp",
          quantity: 10,
          price: 15000,
          src: tiles,
          alt: "tiles",
        },
        {
          id: 3,
          name: "gỗ",
          quantity: 10,
          price: 15000,
          src: wood,
          alt: "wood",
        },
      ],
    },
    {
      id: "2",
      name: "Làm sân",
      date: "March 5, 2025",
      status: "Declined",
      badgeClass: "bg-warning",
      products: [
        {
          id: 1,
          name: "Thép",
          quantity: 10,
          price: 90000,
          src: steel,
          alt: "steel",
        },
        {
          id: 2,
          name: "gạch ốp",
          quantity: 10,
          price: 15000,
          src: tiles,
          alt: "tiles",
        },
        {
          id: 3,
          name: "gỗ",
          quantity: 10,
          price: 15000,
          src: wood,
          alt: "wood",
        },
      ],
    },
    {
      id: "2",
      name: "Làm sân",
      date: "March 5, 2025",
      status: "Canceled",
      badgeClass: "bg-warning",
      products: [
        {
          id: 1,
          name: "Thép",
          quantity: 10,
          price: 90000,
          src: steel,
          alt: "steel",
        },
        {
          id: 2,
          name: "gạch ốp",
          quantity: 10,
          price: 15000,
          src: tiles,
          alt: "tiles",
        },
        {
          id: 3,
          name: "gỗ",
          quantity: 10,
          price: 15000,
          src: wood,
          alt: "wood",
        },
      ],
    },
    {
      id: "2",
      name: "Làm sân",
      date: "March 5, 2025",
      status: "Processing",
      badgeClass: "bg-warning",
      products: [
        {
          id: 1,
          name: "Thép",
          quantity: 10,
          price: 90000,
          src: steel,
          alt: "steel",
        },
        {
          id: 2,
          name: "gạch ốp",
          quantity: 10,
          price: 15000,
          src: tiles,
          alt: "tiles",
        },
        {
          id: 3,
          name: "gỗ",
          quantity: 10,
          price: 15000,
          src: wood,
          alt: "wood",
        },
      ],
    },
    {
      id: "2",
      name: "Làm sân",
      date: "March 5, 2025",
      status: "",
      badgeClass: "bg-warning",
      products: [
        {
          id: 1,
          name: "Thép",
          quantity: 10,
          price: 90000,
          src: steel,
          alt: "steel",
        },
        {
          id: 2,
          name: "gạch ốp",
          quantity: 10,
          price: 15000,
          src: tiles,
          alt: "tiles",
        },
        {
          id: 3,
          name: "gỗ",
          quantity: 10,
          price: 15000,
          src: wood,
          alt: "wood",
        },
      ],
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
          <div className="container">
            {/* row */}
            <div className="row">
              {/* col */}
              {/* col */}
              <div className="col-lg-3 col-md-4 col-12 border-end  d-none d-md-block">
                <div className="mt-5 d-flex justify-content-between align-items-center d-md-none">
                  {/* heading */}
                  <h3 className="fs-5 mb-0">Tài khoản</h3>
                </div>
              </div>
              {/* col */}
              {/* sideBar */}{" "}
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
                        <div className="">
                          <OrderStatus />
                          <OrderList orders={orders} />
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
