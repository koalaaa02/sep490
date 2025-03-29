import { useEffect, useState } from "react";
import MyAccountSideBar from "../../../Component/MyAccountSideBar/MyAccountSideBar";
import ScrollToTop from "../../ScrollToTop";
import { MagnifyingGlass } from "react-loader-spinner";
import styles from "./MyDebt.module.css";
import { AiOutlineShoppingCart } from "react-icons/ai";
import classNames from "classnames";
import CheckoutForm from "../../../Component/MyDebt/CheckoutForm";
import { BASE_URL } from "../../../Utils/config";
const DebtOrder = ({ item, activeShop, setActiveShop, orders }) => {
  return (
    <div
      className={styles.debtOrderCard}
      onClick={() => {
        if (item?.id === activeShop) {
          setActiveShop(null);
        } else {
          setActiveShop(item?.id);
        }
      }}
    >
      <div
        className={classNames(
          "d-flex align-items-center justify-content-between px-2"
        )}
      >
        <div
          className={classNames(
            "d-flex gap-2 align-items-center fw-bold",
            styles.shopName
          )}
        >
          <AiOutlineShoppingCart />
          {item?.shopName}
        </div>
        <input type="checkbox" checked={item?.id === activeShop} />
      </div>
      {item?.id === activeShop && (
        <>
          {orders?.map((o, index) => (
            <div className={styles.itemCard} key={index}>
              <img src={o?.itemImage} alt="" />
              <div className={styles.infoCard}>
                <div className="d-flex flex-column fw-bold">
                  <span>{o?.orderName}</span>
                  {/* <span>50kg/1 bao</span> */}
                </div>
                <div className={classNames(styles.middlePart)}>
                  <span>
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(o?.price)}
                    /1 lần
                  </span>
                  <input
                    className="inputNumber"
                    min="1"
                    disabled
                    value={o?.amount}
                    defaultValue="1"
                  />
                </div>
                <span>
                  {Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(o?.amount * o?.price)}
                </span>
              </div>
            </div>
          ))}
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold">Tổng tiền nợ của đơn hàng</span>
            <span>
              {Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(
                orders?.reduce((acc, index) => {
                  return acc + index?.price * index?.amount;
                }, 0)
              )}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
const MyDebt = () => {
  const token = localStorage.getItem("access_token");
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeShop, setActiveShop] = useState(null);
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/dealer/ShopInvoiceSummary`,
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
        console.log(result);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchData();
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  const shops = [
    {
      id: 1,
      shopName: "shop1",
    },
    {
      id: 2,
      shopName: "shop2",
    },
    {
      id: 3,
      shopName: "shopDunk",
    },
  ];

  const activeShopOrders = [
    {
      orderName: "Xi măng 50kg/1 bao",
      amount: 2,
      price: 1500000,
      itemImage:
        "https://i.pcmag.com/imagery/reviews/00xBy0JjVybodfIwWxeGCkZ-1.fit_lim.size_1050x591.v1679417407.jpg",
    },
    {
      orderName: "Cát xây dựng 1m3",
      amount: 5,
      price: 800000,
      itemImage:
        "https://cdn.mos.cms.futurecdn.net/uPALkW3UzvgE6FhMy3nCzD-1200-80.png",
    },
    {
      orderName: "Gạch xây dựng loại 10x20",
      amount: 50,
      price: 5000,
      itemImage:
        "https://i.pcmag.com/imagery/reviews/00xBy0JjVybodfIwWxeGCkZ-1.fit_lim.size_1050x591.v1679417407.jpg",
    },
    {
      orderName: "Đá 1x2 1m3",
      amount: 3,
      price: 900000,
      itemImage:
        "https://cdn.mos.cms.futurecdn.net/uPALkW3UzvgE6FhMy3nCzD-1200-80.png",
    },
  ];

  return (
    <div>
      <>
        <ScrollToTop />
      </>
      <>
        <div>
          <section>
            {/* container */}
            <div className={"container"}>
              {/* row */}
              <div className="row">
                {/* col */}
                <MyAccountSideBar activeKey={"MyDebt"} />
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
                        <div className="p-lg-10">
                          {/* heading */}
                          <h2 className="">Khoản nợ của bạn</h2>
                          <div className="w-100 d-flex">
                            <div className="col-9">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm kiếm theo tên người bán"
                              />
                              <div className={styles.statistic}>
                                <h5 className={styles.sectionHeader}>
                                  Thống Kê
                                </h5>
                                <p className="fw-bold">
                                  Tổng đơn hàng còn nợ:{" "}
                                  <span className="fw-normal">3</span>
                                </p>
                                <p className="fw-bold">
                                  Tổng tiền nợ:{" "}
                                  <span className="fw-normal">
                                    3.000.000 vnđ
                                  </span>
                                </p>
                              </div>
                              <hr />
                              <div>
                                <h5 className={styles.sectionHeader}>
                                  Các đơn hàng đang còn nợ
                                </h5>
                                <div className={styles.itemsList}>
                                  {shops?.map((i, index) => (
                                    <DebtOrder
                                      item={i}
                                      key={i?.id}
                                      activeShop={activeShop}
                                      orders={activeShopOrders}
                                      setActiveShop={setActiveShop}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className={classNames(styles.total, "col-3")}>
                              <h5 className={styles.sectionHeader}>
                                Khoản nợ đã chọn
                              </h5>
                              <span className={styles.secondaryHeader}>
                                <span className="text-danger">*</span>Bạn có thể
                                thanh toán khoản nợ đã chọn nếu chúng cùng một
                                người bán
                              </span>
                              <div>
                                <p>Số tiền cần thanh toàn</p>
                                <p
                                  className={classNames(
                                    !activeShop && "text-danger",
                                    styles.totalPrice
                                  )}
                                >
                                  {activeShop
                                    ? Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                      }).format(
                                        activeShopOrders?.reduce(
                                          (acc, index) => {
                                            return (
                                              acc + index?.price * index?.amount
                                            );
                                          },
                                          0
                                        )
                                      )
                                    : "Please choose a shop "}
                                </p>
                              </div>
                              <div className="d-flex justify-content-center">
                                <button
                                  disabled={!activeShopOrders}
                                  className={classNames(
                                    "bg-black text-white",
                                    styles.cashOutButton
                                  )}
                                  onClick={() => setShowModal(true)}
                                >
                                  Thanh Toán
                                </button>
                              </div>
                            </div>
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
        <CheckoutForm
          showModal={showModal}
          handleCloseModal={() => setShowModal(false)}
        />
      </>
    </div>
  );
};
export default MyDebt;
