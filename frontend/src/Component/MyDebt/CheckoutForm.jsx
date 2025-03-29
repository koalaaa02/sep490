import classNames from "classnames";
import styles from "./styles.module.css";
import storeImg from "../../images/stores-logo-1.svg";
import { CiWarning } from "react-icons/ci";
const CheckoutForm = ({ showModal, handleCloseModal, data }) => {
  console.log(showModal);

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
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-between",
                  styles.info
                )}
              >
                <div className="d-flex flex-column">
                  <div
                    className={classNames("d-flex align-items-center gap-3")}
                  >
                    <span>Nguyen Van A</span>
                    <span>|</span>
                    <>
                      <span>03759931455</span>
                      <span className={styles.defaultTag}>Mặc định</span>
                    </>
                  </div>
                  <span className={styles.extraInfo}>
                    Khu 3, xã Hoàng Chương.
                  </span>
                  <span className={styles.extraInfo}>
                    Huyện Thanh Ba, Tỉnh Phú Thọ
                  </span>
                </div>
                <button className={styles.changeInfo}>Thay đổi</button>
              </div>

              <div className={styles.order}>
                <div className="d-flex align-items-center gap-3 fw-bold">
                  <img
                    className="rounded-5"
                    src={storeImg}
                    width={50}
                    height={50}
                    alt=""
                  />
                  <span>Công Ty ABC</span>
                </div>
                <table>
                  <thead>
                    <tr className={styles.tbleHeader}>
                      <th class="col-5">Sản phẩm</th>
                      <th class="col-3">Đơn giá</th>
                      <th class="col-1">Số lượng</th>
                      <th class="col-3">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="fw-normal">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <tr className={styles.item} key={index}>
                        <td className="d-flex gap-3">
                          <img
                            className="rounded-3"
                            src={storeImg}
                            width={80}
                            height={80}
                            alt=""
                          />
                          <div className="d-flex flex-column">
                            <span>Xi măng ABC</span>
                            <span>50kg/1 bao</span>
                          </div>
                        </td>
                        <td>
                          {Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(1650000)}{" "}
                          / 1 lần
                        </td>
                        <td>
                          <input
                            type="number"
                            name="amount"
                            min="0"
                            defaultValue={1}
                          />
                        </td>
                        <td>
                          {Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(1650000)}{" "}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex align-items-start">
                <span className="fw-bold">Lời nhắn</span>
                <textarea
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                ></textarea>
              </div>
              <div className="d-flex flex-column gap-4 col-8">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-bold">Số tiền nợ</span>
                    <span
                      className={classNames(styles.textCard, styles.debtTo)}
                    >
                      CongTyABC
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
                  <span className="fw-bold">Tiền đơn hàng</span>
                  <span className={classNames(styles.textCard, "flex-grow-1")}>
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(3300000)}{" "}
                    VND
                  </span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold">Số tiền đã thanh toán</span>
                  <span className={classNames(styles.textCard, "flex-grow-1")}>
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(3200000)}{" "}
                    VND
                  </span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold">Trạng thái</span>
                  <span className={classNames(styles.textCard, "flex-grow-1")}>
                    Tôi muốn thanh toán khoản nợ
                  </span>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className={styles.warningIcon}>
                  <CiWarning size={15} color="#c6b300" />
                </div>
                <div
                  className={classNames(styles.warningMessage, "flex-grow-1")}
                >
                  Hãy nhập số tiền muón thanh toán cho khoản nợ
                </div>
              </div>
              <div className="d-flex flex-column gap-4 col-12">
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold">Nhập số tiền muốn thanh toán</span>
                  <input
                    type="number"
                    className="flex-grow-1"
                    defaultValue={300000}
                  />
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold">
                    Số tiền nợ còn lại của đơn hàng
                  </span>
                  <span className={classNames(styles.textCard, "flex-grow-1")}>
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(100000)}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCloseModal}
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
