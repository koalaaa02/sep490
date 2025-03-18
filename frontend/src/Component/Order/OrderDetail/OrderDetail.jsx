import storeImg from "../../../images/stores-logo-1.svg";
const OrderDetail = ({ order }) => {
  const totalSum = order.products.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);

  return (
    <div className="d-flex p-2 border  mt-2 mb-5 rounded shadow-sm">
      <div className="order-info w-75 ">
        <div className="text-black fw-bold fs-4 pb-2">
          <span className="p-1">
            <img
              className="rounded-5"
              src={storeImg}
              width={50}
              height={50}
              alt=""
            />
          </span>
          <span>{order.name}</span>
        </div>
        <div className="order-product">
          <table class="table table-bordered">
            <thead>
              <tr className="text-center">
                <th scope="col">Sẩn phẩm</th>
                <th scope="col">Đơn giá</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((p) => (
                <tr className="">
                  <th className="d-flex">
                    <img
                      width={200}
                      height={150}
                      className="object-fit-cover"
                      src={p.src}
                      alt=""
                    />{" "}
                    <span className="pl-1 fw-light ">{p.name}</span>
                  </th>
                  <td className="w-20 text-center">
                    {p.price.toLocaleString()}
                  </td>
                  <td className=" w-20 text-center">
                    <input
                      // width={10}
                      className="w-50 text-right"
                      type="number"
                      value={p.quantity}
                    />
                  </td>
                  <td>{(p.quantity * p.price).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="order-button w-25 p-2 text-center d-flex flex-column">
        <div className="bg-primary w-75 rounded mx-auto p-3 text-white fw-bold fs-6 mt-5 ">
          Xem chi tiết
        </div>
        <div className="my-auto">
          <div className="bg-warning-subtle w-80 mx-auto mt-5  py-4 rounded border ">
            <p className="fs-6 fw-bold">Tổng tiền</p>
            <div className="border border-dark py-1 w-50 mx-auto rounded">
              {totalSum.toLocaleString()}
            </div>
          </div>
          <div className={`my-3 ${order.badgeClass} py-2 rounded mx-auto w-60`}>
            {" "}
            Chờ xét duyệt
          </div>
          <div className="my-5 py-1 text-danger border border-danger rounde ">
            Huỷ yêu cầu
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
