import { useEffect, useState } from "react";
import MyAccountSideBar from "../../../Component/MyAccountSideBar/MyAccountSideBar";
import ScrollToTop from "../../ScrollToTop";
import { MagnifyingGlass } from "react-loader-spinner";
import styles from "./MyDebt.module.css";
import { AiOutlineShoppingCart } from "react-icons/ai";
import classNames from "classnames";
const DebtOrder = (item) => {
  const items = item?.item;
  return (
    <div className={styles.debtOrderCard}>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-between px-2"
        )}
      >
        <div className="d-flex gap-2 align-items-center fw-bold">
          <AiOutlineShoppingCart />
          {items?.shopName}
        </div>
        <input type="checkbox" />
      </div>
      {items?.orders?.map((o, index) => (
        <div className={styles.itemCard} key={index}>
          <img src={o?.itemImage} alt="" />
          <div className={styles.infoCard}>
            <div className="d-flex flex-column fw-bold">
              <span>{o?.name}</span>
              <span>50kg/1 bao</span>
            </div>
            <div className={classNames(styles.middlePart)}>
              <span>1.500.000 đ/1 lần</span>
              <input className="inputNumber" min="1" defaultValue="1" />
            </div>
            <span>1.500.000 vnđ</span>
          </div>
        </div>
      ))}
      <div className="d-flex justify-content-between align-items-center">
        <span className="fw-bold">Tổng tiền nợ của đơn hàng</span>
        <span>300.000 vnđ</span>
      </div>
    </div>
  );
};
const MyDebt = () => {
  const [loaderStatus, setLoaderStatus] = useState(true);
  const items = [
    {
      shopName: "Shop 1",
      orders: [
        {
          itemImage:
            "https://c4.wallpaperflare.com/wallpaper/987/319/586/windows-11-dark-theme-silk-hd-wallpaper-preview.jpg",
          name: "Xi măng",
        },
        {
          itemImage:
            "https://c4.wallpaperflare.com/wallpaper/987/319/586/windows-11-dark-theme-silk-hd-wallpaper-preview.jpg",
          name: "Xi măng",
        },
        {
          itemImage:
            "https://c4.wallpaperflare.com/wallpaper/987/319/586/windows-11-dark-theme-silk-hd-wallpaper-preview.jpg",
          name: "Xi măng",
        },
      ],
    },
    {
      shopName: "Shop 2",
      orders: [
        {
          itemImage:
            "https://c4.wallpaperflare.com/wallpaper/987/319/586/windows-11-dark-theme-silk-hd-wallpaper-preview.jpg",
          name: "Xi măng",
        },
        {
          itemImage:
            "https://c4.wallpaperflare.com/wallpaper/987/319/586/windows-11-dark-theme-silk-hd-wallpaper-preview.jpg",
          name: "Xi măng",
        },
      ],
    },
  ];
  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);
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
                                  {items?.map((i, index) => (
                                    <DebtOrder item={i} key={index} />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div
                              className={classNames(styles.total, "col-3")}
                            >
                              <h5 className={styles.sectionHeader}>
                                Khoản nợ đã chọn
                              </h5>
                              <span className={styles.secondaryHeader}>
                                <span className="text-danger">*</span>Bạn có thể thanh toán khoản nợ đã
                                chọn nếu chúng cùng một người bán
                              </span>
                              <div>
                                <p>Số tiền cần thanh toàn</p>
                                <p className={classNames("text-danger", styles.totalPrice)}>300.000 vnđ</p>
                              </div>
                              <div className="d-flex justify-content-center">
                                <button className={classNames("bg-black text-white", styles.cashOutButton)}>Thanh Toán</button>
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
      </>
    </div>
  );
};
export default MyDebt;
