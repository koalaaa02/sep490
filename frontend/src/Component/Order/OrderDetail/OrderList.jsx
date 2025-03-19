import OrderDetail from "./OrderDetail";
const OrderList = ({ orders }) => {
  return (
    <>
      {orders.map((o) => (
        <OrderDetail order={o} />
      ))}
    </>
  );
};

export default OrderList;
