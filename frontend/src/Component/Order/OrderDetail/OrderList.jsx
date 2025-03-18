import cement from "../../../images/cement.jpg";
import bricks from "../../../images/bricks.jpg";
import sand from "../../../images/sand.jpg";
import steel from "../../../images/steel.jpg";
import tiles from "../../../images/tiles.png";
import wood from "../../../images/wood.jpg";
import OrderDetail from "./OrderDetail";
const OrderList = () => {
  const orders = [
    {
      id: "1",
      name: "Xây nhà",
      date: "March 5, 2025",
      status: "Processing",
      badgeClass: "bg-warning",
      products: [
        {
          id: 1,
          name: "Xi măng",
          quantity: 10,
          price: 90000,
          src: cement,
          alt: "cement",
        },
        {
          id: 2,
          name: "Cát",
          quantity: 10,
          price: 15000,
          src: sand,
          alt: "sand",
        },
        {
          id: 3,
          name: "Gạch",
          quantity: 10,
          price: 15000,
          src: bricks,
          alt: "bricks",
        },
      ],
      price: 10 * 90000 + 10 * 15000 + 10 * 15000,
    },
    {
      id: "2",
      name: "Làm sân",
      date: "March 5, 2025",
      status: "Processing",
      badgeClass: "bg-warning",
      products: [
        {
          id: 1,
          name: "Thép",
          quantity: 10,
          price: 90000,
          src: steel,
          alt: "steel",
        },
        {
          id: 2,
          name: "gạch ốp",
          quantity: 10,
          price: 15000,
          src: tiles,
          alt: "tiles",
        },
        {
          id: 3,
          name: "gỗ",
          quantity: 10,
          price: 15000,
          src: wood,
          alt: "wood",
        },
      ],
      price: 10 * 90000 + 10 * 15000,
    },
  ];

  return (
    <>
      {orders.map((o) => (
        <OrderDetail order={o} />
      ))}
    </>
  );
};

export default OrderList;
