import { useEffect, useState } from "react";
import MyAccountSideBar from "../../../Component/MyAccountSideBar/MyAccountSideBar";
import ScrollToTop from "../../ScrollToTop";
import { MagnifyingGlass } from "react-loader-spinner";
import styles from "./MyDebt.module.css";
import { AiOutlineShoppingCart } from "react-icons/ai";
import classNames from "classnames";
import CheckoutForm from "../../../Component/MyDebt/CheckoutForm";
import { BASE_URL } from "../../../Utils/config";
import { format } from "date-fns";
const DebtOrder = ({ item, activeShop, setActiveShop, orders }) => {
  return (
    <div
      className={styles.debtOrderCard}
      onClick={() => {
        if (item === activeShop) {
          setActiveShop(null);
        } else {
          setActiveShop(item);
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
        <input type="checkbox" checked={item?.shopId === activeShop?.shopId} />
      </div>
      {item?.shopId === activeShop?.shopId && (
        <>
          <table className={styles.shopDebtDetail}>
            <thead>
              <th className="col-4">Thời gian giao dịch</th>
              <th className="col-4">Tổng nợ</th>
              <th className="col-4">Số tiền còn nợ</th>
            </thead>
            <tbody>
              {orders
                ?.filter((o) => o?.status !== "PAID")
                ?.map((o) => (
                  <tr className={styles.itemCard} key={o?.id}>
                    <td className="fw-bold">
                      {format(new Date(o?.createdAt), "dd-MM-yyyy")}
                    </td>
                    <td>
                      {Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(o?.totalAmount)}
                    </td>
                    <td className="text-danger">
                      {Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(o?.totalAmount - o?.paidAmount)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between alig n-items-center">
            <span className="fw-bold">Tổng tiền còn nợ của đơn hàng</span>
            <span>
              {Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(
                orders
                  ?.filter((o) => o?.status !== "PAID")
                  ?.reduce((acc, index) => {
                    return acc + (index?.totalAmount - index?.paidAmount);
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
  const [shops, setShops] = useState([]);
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
        setShops(result);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchData();
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/dealer/GetInvoicesByShopId/${activeShop?.shopId}`,
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
        setOrders(result);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    if (activeShop?.shopId) {
      fetchData();
    }
  }, [activeShop?.shopId]);

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
                                  {shops?.length > 0 &&
                                    shops?.map((i) => (
                                      <DebtOrder
                                        item={i}
                                        key={i?.shopId}
                                        activeShop={activeShop}
                                        orders={orders}
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
                                    !activeShop?.shopId && "text-danger",
                                    styles.totalPrice
                                  )}
                                >
                                  {activeShop?.shopId
                                    ? Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                      }).format(
                                        orders
                                          ?.filter((o) => o?.status !== "PAID")
                                          ?.reduce((acc, index) => {
                                            return (
                                              acc +
                                              (index?.totalAmount -
                                                index?.paidAmount)
                                            );
                                          }, 0)
                                      )
                                    : "Chọn khoản nợ "}
                                </p>
                              </div>
                              <div className="d-flex justify-content-center">
                                <button
                                  disabled={!activeShop}
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
          shop={activeShop}
          orders={orders}
        />
      </>
    </div>
  );
};
export default MyDebt;
