import storeImg from "../../../images/stores-logo-1.svg";
import { Image } from "react-bootstrap";
import { BASE_URL } from "../../../Utils/config";
import { useNavigate } from "react-router-dom";

const OrderDetail = ({ order, status }) => {
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const totalSum = order.products.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);
  const statusTab = {
    PENDING: "Đang chờ",
    ACCEPTED: "Đã chấp nhận",
    PACKAGING: "Đóng gói",
    FINDINGTRUCK: "Tìm xe tải",
    DELIVERING: "Đang giao",
    DELIVERED: "Đã giao",
    CANCELLED: "Đã hủy",
  };
  const handleCanceled = async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/dealer/change-status/${id}?status=CANCELLED`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("Đã huỷ đơn hàng thành công");
      }
    } catch (error) {
      alert("Đã có lỗi xảy ra, vui lòng thử lại");
    }
  };
  function renderButton(status) {
    if (status === "PENDING" || status === "FINDINGTRUCK") {
      return (
        <button
          onClick={() => handleCanceled(order.id)}
          className="btn btn-outline-danger mt-3 min-wh-10"
        >
          Cancel
        </button>
      );
    } else {
      return (
        <button className="btn btn-outline-success mt-3">
          {statusTab[status] || "Order Status"}
        </button>
      );
    }
  }

  return (
    <div className=" container border  mt-2 mb-5 rounded shadow-sm">
      <div className=" d-flex pt-3 justify-content-between align-items-center">
        <div className="container d-flex align-items-center">
          <span className="">
            <Image
              rounded
              width={50}
              height={50}
              src={storeImg}
              alt=""
              srcset=""
            />
          </span>
          <span className="fw-bold ml-2">{order.shopName}</span>

          <div className="rounded-2 d-flex align-content-center">
            <span className="ml-2 bg-warning rounded me-1 border border-warning text-white  py-2 px-2 border-end-0">
              Nhắn tin
            </span>
            <span
              className=" btn btn-outline-danger px-2
            "
              onClick={() => navigate(`/SingleShop/${order.shopId}`)}
            >
              Xem shop
            </span>
          </div>
        </div>
        <div className="mr-2 text-info fs-6 fw-medium w-20">
          <span>{statusTab[status]}</span>
        </div>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-center my-2">
        <div>
          {order.products.map((p) => (
            <div className="d-flex w-70">
              <div>
                <img
                  style={{
                    width: "100px",
                    height: "100px",
                    overflow: "hidden",
                  }}
                  className="rounded"
                  src={p.image}
                  alt=""
                  srcset=""
                />
              </div>
              <div className="ml-2">
                <div className="fw-bold">{p.productName}</div>
                <div className="fw-medium">x{p.quantity}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center w-30">
          <div className="d-flex align-items-center">
            <small className="fw-normal mr-2">Thành tiền:</small>
            <div className="fs-4 fw-semibold text-danger">{`${totalSum.toLocaleString()} vnd`}</div>
          </div>
          {renderButton(order.status)}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
