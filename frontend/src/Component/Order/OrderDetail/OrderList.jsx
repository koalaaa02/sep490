import OrderDetail from "./OrderDetail";
import empty from "../../../images/delete.png";
const OrderList = ({ orders, status }) => {
  const statusTab = {
    PENDING: "Đang chờ",
    ACCEPTED: "Đã chấp nhận",
    PACKAGING: "Đóng gói",
    FINDINGTRUCK: "Tìm xe tải",
    DELIVERING: "Đang giao",
    DELIVERED: "Đã giao",
    LOST: "Mất hàng",
    CANCELLED: "Đã hủy",
  };
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center mt-5">
        <img width={200} src={empty} alt="" />
        <p>
          Không có đơn hàng nào{" "}
          {statusTab[status].charAt(0).toLowerCase() +
            statusTab[status]?.slice(1)}
        </p>
      </div>
    );
  }
  return (
    <>
      {orders?.map((o) => (
        <OrderDetail order={o} status={status} />
      ))}
    </>
  );
};

export default OrderList;
