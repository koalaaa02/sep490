import styles from "./style.module.css";
const OrderStatus = () => {
  return (
    <div className={styles.orderStatusContainer}>
      <div className={styles.orderStatusItem}>Tất Cả</div>
      <div className={styles.orderStatusItem}>Chờ xét duyệt</div>
      <div className={styles.orderStatusItem}>Chấp nhận</div>
      <div className={styles.orderStatusItem}>Hoành thành</div>
      <div className={styles.orderStatusItem}>Từ chối</div>
      <div className={styles.orderStatusItem}>Đã huỷ</div>
    </div>
  );
};

export default OrderStatus;
