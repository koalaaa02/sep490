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

const DebtOrder = ({
  item,
  activeShop,
  setActiveShop,
  orders,
  selectedOrders,
  setSelectedOrders,
}) => {
  const formatCurrency = (amount) => {
    if (isNaN(amount)) return "0 VNĐ";
    const formattedAmount = amount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formattedAmount} VNĐ`;
  };

  const toggleOrderSelection = (order) => {
    if (selectedOrders?.id === order.id) {
      setSelectedOrders(null);
    } else {
      setSelectedOrders(order);
    }
  };

  return (
    <div
      className={styles.debtOrderCard}
      onClick={(e) => {
        if (e.target.type === "checkbox") return;
        if (item === activeShop) {
          setActiveShop(null);
          setSelectedOrders(null);
        } else {
          setActiveShop(item);
          setSelectedOrders(null);
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
          Tên nhà phân phối: {item?.shopName}
        </div>
        <input
          type="checkbox"
          checked={item?.shopId === activeShop?.shopId}
          onClick={(e) => e.stopPropagation()}
          readOnly
        />
      </div>
      {item?.shopId === activeShop?.shopId && (
        <>
          <table className={styles.shopDebtDetail}>
            <thead>
              <tr>
                <th className="col-1" />
                <th className="col-3">Thời gian giao dịch</th>
                <th className="col-3">Tổng nợ</th>
                <th className="col-3">Số tiền còn nợ</th>
              </tr>
            </thead>
            <tbody>
              {orders
                ?.filter((o) => o?.status !== "PAID")
                ?.map((o) => (
                  <tr className={styles.itemCard} key={o?.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedOrders?.id === o?.id}
                        onChange={() => toggleOrderSelection(o)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="fw-bold">
                      {format(new Date(o?.createdAt), "dd-MM-yyyy")}
                    </td>
                    <td>{formatCurrency(o?.totalAmount)}</td>
                    <td className="text-danger">
                      {formatCurrency(o?.totalAmount - o?.paidAmount)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold">Tổng tiền còn nợ của đơn hàng</span>
            <span>
              {formatCurrency(
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
  const token = sessionStorage.getItem("access_token");
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeShop, setActiveShop] = useState(null);
  const [shops, setShops] = useState([]);
  const [orders, setOrders] = useState([]);
  // selectedOrders giữ object đơn hàng hoặc null
  const [selectedOrders, setSelectedOrders] = useState(null);

  const formatCurrency = (amount) => {
    if (isNaN(amount)) return "0 VNĐ";
    const formattedAmount = amount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formattedAmount} VNĐ`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/dealer/ShopInvoiceSummary?page=1&size=10&sortBy=shop_id&direction=ASC`,
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
  }, [token]);

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
      setSelectedOrders(null);
    }
  }, [activeShop?.shopId, token]);

  return (
    <div>
      <ScrollToTop />
      <div>
        <section>
          <div className={"container"}>
            <div className="row">
              <MyAccountSideBar activeKey={"MyDebt"} />
              <div className="col-lg-9 col-md-8 col-12">
                <div>
                  {loaderStatus ? (
                    <div className="loader-container">
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
                        <h2 className="">Khoản nợ của bạn</h2>
                        <div className="w-100 d-flex">
                          <div className="col-9">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Tìm kiếm theo tên người bán"
                            />
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
                                      selectedOrders={selectedOrders}
                                      setSelectedOrders={setSelectedOrders}
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
                              <p>Số tiền cần thanh toán</p>
                              <p
                                className={classNames(
                                  !activeShop?.shopId && "text-danger",
                                  styles.totalPrice
                                )}
                              >
                                {activeShop?.shopId && selectedOrders !== null
                                  ? formatCurrency(
                                      selectedOrders.totalAmount -
                                        selectedOrders.paidAmount
                                    )
                                  : "Chọn khoản nợ "}
                              </p>
                            </div>
                            <div className="d-flex justify-content-center">
                              <button
                                disabled={
                                  !activeShop || selectedOrders === null
                                }
                                className={classNames(
                                  "bg-black text-white",
                                  styles.cashOutButton
                                )}
                                onClick={() => {
                                  if (selectedOrders === null) {
                                    alert(
                                      "Vui lòng chọn ít nhất một đơn hàng để thanh toán."
                                    );
                                    return;
                                  }
                                  setShowModal(true);
                                }}
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
        orders={selectedOrders ? [selectedOrders] : []}
        selectedOrders={selectedOrders ? [selectedOrders.id] : []}
      />
    </div>
  );
};

export default MyDebt;
