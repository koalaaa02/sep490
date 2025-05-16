import classNames from "classnames";
import styles from "./styles.module.css";
import { CiWarning } from "react-icons/ci";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../Utils/config";
import { useSelector } from "react-redux";

const CheckoutForm = ({ showModal, handleCloseModal, shop, orders }) => {
  const token = sessionStorage.getItem("access_token");

  const totalDebt = orders
    ?.filter((o) => o?.status !== "PAID")
    ?.reduce((acc, index) => acc + index?.totalAmount, 0);

  const totalPaidAmount = orders
    ?.filter((o) => o?.status !== "PAID")
    ?.reduce((acc, index) => acc + index?.paidAmount, 0);
  
  const remainingDebt = totalDebt - totalPaidAmount;

  const [amount, setAmount] = useState(remainingDebt); 
  const [payMode, setPayMode] = useState("payAll");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (payMode === "payAll") {
      setAmount(remainingDebt);
    } else {
      setAmount(0); 
    }
  }, [payMode, remainingDebt]); 

  const formatCurrency = (amount) => {
    if (isNaN(amount)) return "0 VNĐ";
    const formattedAmount = amount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formattedAmount} VNĐ`;
  };

  const pay = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/payment/pay?${new URLSearchParams({
          paymentProvider: "VNPAY",
          paymentType: "INVOICE",
          amount: amount,
          bankCode: "",
          referenceId: orders[0]?.id,
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

  const handleAmountChange = (e) => {
    const enteredAmount = parseFloat(e.target.value);

    if (enteredAmount <= 0) {
      setAmount("");
      setErrorMessage("Số tiền phải lớn hơn 0.");
    } else if (enteredAmount > remainingDebt) {
      setAmount("");
      setErrorMessage(
        "Số tiền nhập vào không được vượt quá số tiền nợ còn lại."
      );
    } else {
      setAmount(enteredAmount);
      setErrorMessage("");
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
            <div className="modal-body d-flex flex-column gap-3">
              <div className="d-flex flex-column gap-4 col-12">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-bold">Tên nhà phân phối</span>
                    <span
                      className={classNames(styles.textCard, styles.debtTo)}
                    >
                      {shop?.shopName}
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold">Tổng Tiền Nợ</span>
                  <span className={classNames(styles.textCard, "flex-grow-1")}>
                    {formatCurrency(totalDebt)}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold">Số tiền đã thanh toán</span>
                  <span className={classNames(styles.textCard, "flex-grow-1")}>
                    {formatCurrency(totalPaidAmount)}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold">Trạng thái</span>
                  <select
                    className={classNames(styles.textCard, "flex-grow-1")}
                    onChange={(e) => setPayMode(e.target.value)}
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

              {/* Nhập số tiền muốn thanh toán */}
              <div className="d-flex flex-column gap-4 col-12">
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold">Nhập số tiền muốn thanh toán</span>
                  <input
                    type="number"
                    className="flex-grow-1"
                    value={amount}
                    disabled={payMode === "payAll"}
                    onChange={handleAmountChange}
                  />
                </div>

                {errorMessage && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {errorMessage}
                  </div>
                )}

                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold">
                    Số tiền nợ còn lại của đơn hàng sau khi thanh toán
                  </span>
                  <span className={classNames(styles.textCard, "flex-grow-1")}>
                    {formatCurrency(remainingDebt - amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer - Thanh toán */}
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={pay}>
                Thanh Toán
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal backdrop */}
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
