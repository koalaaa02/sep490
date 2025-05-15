import { useState } from "react";
import styles from "./style.module.css";

const OrderStatus = ({ setStatus }) => {
  const [statusActive, setStatusActive] = useState("PENDING");

  const statusTab = [
    { code: "PENDING", label: "Đang chờ" },
    { code: "ACCEPTED", label: "Đã chấp nhận" },
    // { code: "PACKAGING", label: "Đóng gói" },
    // { code: "FINDINGTRUCK", label: "Tìm xe tải" },
    { code: "DELIVERING", label: "Đang giao" },
    { code: "DELIVERED", label: "Đã giao" },
    // { code: "LOST", label: "Mất hàng" },
    { code: "CANCELLED", label: "Đã hủy" },
  ];

  return (
    <div className={styles.orderStatusContainer}>
      {statusTab.map((status) => (
        <div
          key={status.code}
          onClick={() => {
            setStatusActive(status.code);
            setStatus(status.code);
          }}
          className={`${styles.orderStatusItem}  ${
            statusActive === status.code ? ` ${styles.activeStatus}` : ""
          }`}
        >
          {status.label}
        </div>
      ))}
    </div>
  );
};

export default OrderStatus;
