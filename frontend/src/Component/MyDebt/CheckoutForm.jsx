import classNames from "classnames";
import styles from "./styles.module.css";
import storeImg from "../../images/stores-logo-1.svg";
import { CiWarning } from "react-icons/ci";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../Utils/config";
import PaymentMethods from "../PaymentMethod";
import { useSelector } from "react-redux";
const CheckoutForm = ({ showModal, handleCloseModal, shop, orders }) => {
  const token = sessionStorage.getItem("access_token");
  const bankCode = useSelector((state) => state.purchase.bank);
  const [amount, setAmount] = useState(
    orders
      ?.filter((o) => o?.status !== "PAID")
      ?.reduce((acc, index) => {
        return acc + index?.totalAmount;
      }, 0)
  );
  const [payMode, setPayMode] = useState("payAll");
  useEffect(() => {
    if (payMode === "payAll") {
      setAmount(
        orders
          ?.filter((o) => o?.status !== "PAID")
          ?.reduce((acc, index) => {
            return acc + index?.totalAmount;
          }, 0)
      );
    } else {
      setAmount(0);
    }
  }, [payMode]);

  const pay = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/payment/pay?${new URLSearchParams({
          paymentProvider: "VNPAY",
          paymentType: "INVOICE",
          amount: amount,
          bankCode: "",
          referenceId: shop?.shopId,
        })}`,
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
      window.location.href = result?.paymentUrl;
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
  };
  return (
    <>
      <div
        className={`modal fade ${showModal && "show"}`}
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Thanh toán khoản nợ
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className={"modal-body d-flex flex-column gap-3"}>
              <div className="d-flex flex-column gap-4 col-12">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-bold">Số tiền nợ</span>
                    <span
                      className={classNames(styles.textCard, styles.debtTo)}
                    >
                      {shop?.shopName}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-3 flex-grow-1">
                    <span className="fw-bold">Còn</span>
                    <span
                      className={classNames(styles.textCard, "flex-grow-1")}
                    >
                      {Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(300000)}{" "}
                      VND
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold">Tổng Tiền Nợ</span>
                  <span className={classNames(styles.textCard, "flex-grow-1")}>
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(
                      orders
                        ?.filter((o) => o?.status !== "PAID")
                        ?.reduce((acc, index) => {
                          return acc + index?.totalAmount;
                        }, 0)
                    )}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold">Số tiền đã thanh toán</span>
                  <span className={classNames(styles.textCard, "flex-grow-1")}>
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(
                      orders
                        ?.filter((o) => o?.status !== "PAID")
                        ?.reduce((acc, index) => {
                          return acc + index?.paidAmount;
                        }, 0)
                    )}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold">Trạng thái</span>
                  <select
                    className={classNames(styles.textCard, "flex-grow-1")}
                    onChange={(e) => {
                      setPayMode(e?.target?.value);
                    }}
                  >
                    <option value="payAll">Tôi muốn thanh toán khoản nợ</option>
                    <option value="payPart">Tôi muốn một phần nợ</option>
                  </select>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className={styles.warningIcon}>
                  <CiWarning size={15} color="#c6b300" />
                </div>
                <div
                  className={classNames(styles.warningMessage, "flex-grow-1")}
                >
                  Hãy nhập số tiền muốn thanh toán cho khoản nợ
                </div>
              </div>
              <div className="d-flex flex-column gap-4 col-12">
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold">Nhập số tiền muốn thanh toán</span>
                  <input
                    type="number"
                    className="flex-grow-1"
                    value={amount}
                    disabled={payMode === "payAll"}
                    onChange={(e) => {
                      setAmount(e?.target?.value);
                    }}
                  />
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold">
                    Số tiền nợ còn lại của đơn hàng sau khi thanh toán
                  </span>
                  <span className={classNames(styles.textCard, "flex-grow-1")}>
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(100000 - amount)}
                  </span>
                </div>
              </div>
            </div>
            <PaymentMethods />
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  pay();
                }}
              >
                Thanh Toán
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div
          className="modal-backdrop fade show"
          onClick={handleCloseModal}
        ></div>
      )}
    </>
  );
};

export default CheckoutForm;
