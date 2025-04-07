import { useState } from "react";
import styles from "./style.module.css";
const OrderStatus = ({ setStatus }) => {
  const [statusActive, setStatusActive] = useState("PENDING");
  const statusTab = [
    "PENDING",
    "ACCEPTED",
    "PACKAGING",
    "FINDINGTRUCK",
    "DELIVERING",
    "DELIVERED",
    "LOST",
    "CANCELLED",
  ];
  return (
    <div className="d-flex">
      {statusTab.map((s) => (
        <div
          onClick={(e) => {
            setStatusActive(s);
            setStatus(s);
          }}
          className={`${styles.orderStatusItem}  ${
            statusActive === s ? ` ${styles.activeStatus}` : ""
          }`}
        >
          {s}
        </div>
      ))}
    </div>
  );
};

export default OrderStatus;
