import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../Utils/config";
import { Modal, Button, Form, Card } from "react-bootstrap";
import AddInvoice from "../Invoice/AddInvoice";
import AddPayment from "../Invoice/AddPayment";

const OrderDetails = ({ order, onBack, fromDeliveryList }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(order?.id || null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [data, setData] = useState(order);
  const [user, setUser] = useState(null);
  const [deliNotes, setdeliNotes] = useState("");

  const token = localStorage.getItem("access_token");

  const statusOptions = [
    "PENDING",
    "CANCELLED",
    "FINDINGTRUCK",
    "ACCEPTED",
    "PACKAGING",
    "DELIVERING",
    "DELIVERED",
  ];

  const statusTranslations = {
    PENDING: "Đang chờ",
    CANCELLED: "Hủy",
    FINDINGTRUCK: "Đang tìm xe",
    ACCEPTED: "Chấp nhận",
    PACKAGING: "Đóng gói",
    DELIVERING: "Giao hàng",
    DELIVERED: "Đã giao",
  };

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedOrder(orderId);
    setSelectedStatus(newStatus);

    if (newStatus === "DELIVERING") {
      setShowConfirm(true);
    } else if (newStatus === "DELIVERED") {
      if (data.paymentMethod === "COD") {
        setShowPaymentPopup(true);
      } else {
        setShowPopup(true);
      }
    } else {
      setShowPopup(true);
    }
  };

  const [selectedNote, setSelectedNote] = useState(null);
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [noteDetails, setNoteDetails] = useState(null);
  const [loadingNote, setLoadingNote] = useState(false);

  const handleViewDeliveryNote = (note) => {
    setSelectedNote(note);
    setShowNotePopup(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedOrder || !selectedStatus) return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/provider/orders/change-status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: [selectedOrder],
            status: selectedStatus,
          }),
        }
      );

      if (response.ok) {
        setData((prev) => ({
          ...prev,
          status: selectedStatus,
        }));
        alert("Cập nhật trạng thái thành công!");
      } else {
        alert("Cập nhật thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Có lỗi xảy ra!");
    } finally {
      setShowPopup(false);
      setShowPaymentPopup(false);
      setShowConfirm(false);
      setSelectedOrder(null);
      setSelectedStatus("");
    }
  };

  const confirmPaymentAndCreateInvoice = async () => {
    if (!paymentAmount || paymentAmount <= 0) {
      alert("Số tiền thanh toán phải lớn hơn 0.");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/provider/orders/change-status-and_create-invoice`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedOrder,
            amount: paymentAmount,
            status: "DELIVERED",
          }),
        }
      );

      if (response.ok) {
        setData((prev) => ({
          ...prev,
          status: "DELIVERED",
        }));
        alert("Đơn nợ đã được tạo thành công!");
        setShowPaymentPopup(false);
      } else {
        alert("Có lỗi khi tạo đơn nợ. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn nợ:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const toggleInvoiceForm = () => setShowInvoiceForm(true);
  const closeAddInvoice = () => onBack();

  const togglePaymetForm = () => setShowAddPayment(true);
  const closeAddPayment = () => onBack();

  useEffect(() => {
    const fetchNoteDetails = async () => {
      if (showNotePopup && selectedNote) {
        setLoadingNote(true);
        try {
          const response = await fetch(
            `${BASE_URL}/api/provider/deliverynotes/${selectedNote.id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json",
              },
            }
          );
          const result = await response.json();
          setNoteDetails(result);
        } catch (error) {
          console.error("Lỗi khi lấy chi tiết phiếu giao:", error);
        } finally {
          setLoadingNote(false);
        }
      }
    };

    fetchNoteDetails();
  }, [showNotePopup, selectedNote]);

  const refreshOrderDetails = async () => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: 1,
          size: 10000,
          sortBy: "id",
          paymentMethod: "",
          direction: "DESC",
        });

        const response = await fetch(
          `${BASE_URL}/api/provider/orders/?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };
    fetchData();
  };

  const totalDeliveredQuantity = deliNotes.content?.reduce((sum, note) => {
    const detailSum = note.deliveryDetails?.reduce((subSum, item) => {
      return subSum + (item.quantity || 0);
    }, 0);
    return sum + detailSum;
  }, 0);

  const totalOrderQuantity = data.orderDetails?.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const productQuantities =
    deliNotes.content?.flatMap(
      (note) =>
        note.deliveryDetails?.map((detail) => ({
          skuId: detail.orderDetailId.skuId,
          quantity: detail.quantity,
        })) || []
    ) || [];

  console.log(order);

  const params = new URLSearchParams({
    page: 1,
    size: 100,
    sortBy: "id",
    direction: "ASC",
  });

  useEffect(() => {
    getUser();
    getDeli();
  }, []);

  const getUser = async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/provider/invoices/GetAllByDealerId/${
          order.createdBy
        }?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const dataUser = await response.json();
      setUser(dataUser);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const getDeli = async () => {
    try {
      const response1 = await fetch(
        `${BASE_URL}/api/provider/deliverynotes/?page=1&size=1000&sortBy=id&direction=ASC&orderId=${order.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data1 = await response1.json();
      setdeliNotes(data1);
    } catch (error) {
      console.error("Lỗi load api:", error);
    }
  };

  const filteredData = user?.content?.filter(
    (item) => item.order?.id === order?.id
  );

  return (
    <>
      {showInvoiceForm ? (
        <AddInvoice
          closeAddInvoice={closeAddInvoice}
          productQuantities ={productQuantities}
          orderData={data}
          onInvoiceCreated={async () => {
            await refreshOrderDetails();
          }}
        />
      ) : showAddPayment ? (
        <AddPayment
          closeAddPayment={closeAddPayment}
          orderData={data}
          onPaymentCreated={async () => {
            await refreshOrderDetails();
          }}
        />
      ) : (
        <div className="p-3 mb-10" style={{ height: "100%" }}>
          <div className="d-flex align-items-center mb-2">
            <button className="btn btn-secondary me-2" onClick={onBack}>
              Quay lại
            </button>
            <h4>Chi tiết đơn hàng:</h4>
          </div>

          <Card className="mt-4">
            <Card.Header>
              <strong>Thông tin đơn hàng</strong>
            </Card.Header>
            <Card.Body>
              <div className="row">
                {/* Cột trái */}
                <div className="col-md-4 mb-2">
                  <div className="mb-2 d-flex align-items-center">
                    <strong className="me-2">Mã đơn hàng:</strong>
                    <span className="text-muted">{data.orderCode}</span>
                  </div>
                  <div className="mb-2 d-flex align-items-center">
                    <strong className="me-2">Người nhận:</strong>
                    <strong className="text-danger">
                      {data.address?.recipientName}
                    </strong>
                  </div>
                </div>

                {/* Cột giữa */}
                <div className="col-md-4 mb-2">
                  <div className="mb-2 d-flex align-items-center">
                    <strong className="me-2">Ngày tạo:</strong>
                    <span className="text-muted">
                      {new Date(data.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div className="mb-2 d-flex align-items-center">
                    <strong className="me-2">Số điện thoại người nhận:</strong>
                    <span className="text-muted">{data.address?.phone}</span>
                  </div>
                </div>
              </div>

              {/* Địa chỉ giao */}
              <div className="row">
                <div className="col-12 d-flex align-items-center mb-2">
                  <strong className="me-2">Địa chỉ nhận hàng tại kho:</strong>
                  <span className="text-muted">
                    {`${data.address?.address}, ${data.address?.ward}, ${data.address?.province}`}
                  </span>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="row">
                <div className="col-12 d-flex align-items-center mb-2">
                  <strong className="me-2">Phương thức:</strong>
                  <span className="text-danger text-decoration-underline">
                    {data.paymentMethod !== "COD"
                      ? "Thanh toán khi đã nhận hàng"
                      : "Thanh toán khi đã nhận hàng"}
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="mt-2">
            <Card.Header>
              <strong>Danh sách sản phẩm</strong>
            </Card.Header>
            <Card.Body>
              <div className="row">
                <div className="row">
                  <div className="col-6 d-flex align-items-center mb-2">
                    <strong className="me-2">Tên nhà cung cấp:</strong>
                    <span className="text-muted">{data.shop?.name}</span>
                  </div>
                  <div className="col-6 d-flex align-items-center mb-2">
                    <strong className="me-2">Mã số thuế:</strong>
                    <span className="text-muted">{data.shop?.tin}</span>
                  </div>
                </div>
              </div>
              <table className="table table-bordered table-striped mt-3">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Ảnh sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th>Đơn giá</th>
                    {/* <th>Đơn vị</th> */}
                    <th>Số lượng</th>
                    <th>Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.orderDetails?.map((detail, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <img
                          src={detail.productSku.images}
                          alt=""
                          style={{ height: "50px", width: "50px" }}
                        />
                      </td>
                      <td>{detail.productSku.skuCode}</td>
                      <td>
                        {detail.productSku.sellingPrice.toLocaleString()} VND
                      </td>
                      <td>{detail.quantity}</td>
                      <td>
                        {(
                          detail.quantity * detail.productSku.sellingPrice
                        ).toLocaleString()}{" "}
                        VND
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ fontWeight: "bold", marginTop: "10px" }}>
                Tổng tiền:{" "}
                <strong className="text-danger">
                  {data.orderDetails
                    ?.reduce(
                      (sum, detail) =>
                        sum + detail.quantity * detail.productSku.sellingPrice,
                      0
                    )
                    .toLocaleString()}{" "}
                  VND
                </strong>
              </div>
            </Card.Body>
          </Card>

          <Card className="mt-2">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <strong>Lịch sử giao hàng </strong>

              {!fromDeliveryList &&
                data.status === "DELIVERING" &&
                totalDeliveredQuantity < totalOrderQuantity && (
                  <button
                    className="btn btn-primary"
                    onClick={toggleInvoiceForm}
                  >
                    Thêm phiếu giao hàng
                  </button>
                )}
            </Card.Header>
            {!order.deliveryNotes || order.deliveryNotes.length === 0 ? (
              <strong className="m-2 text-danger">
                Chưa có lịch sử giao hàng
              </strong>
            ) : (
              <Card.Body>
                <table className="table table-bordered table-striped mt-3">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã giao hàng</th>
                      <th>Ngày giao hàng</th>
                      <th>Người nhận</th>
                      <th>Địa chỉ kho giao hàng</th>
                      <th>Số điện thoại người nhận</th>
                      <th>Phương thức thanh toán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.deliveryNotes?.map((detail, idx) => (
                      <tr
                        key={idx}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleViewDeliveryNote(detail)}
                      >
                        <td>{idx + 1}</td>
                        <td>{detail.deliveryCode}</td>
                        <td>
                          {
                            new Date(detail.deliveredDate)
                              .toISOString()
                              .split("T")[0]
                          }
                        </td>
                        <td>{data.address?.recipientName}</td>
                        <td>
                          {`${data.address?.address}, ${data.address?.ward}, ${data.address?.province}`}
                        </td>
                        <td>{data.address?.phone}</td>
                        <td>
                          {data.paymentMethod !== "COD"
                            ? "Thanh toán khi nhận hết hàng"
                            : "Thanh toán khi nhận hết hàng"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Body>
            )}
          </Card>

          <Card className="mt-2">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <strong>Lịch sử giao dịch</strong>
              {!fromDeliveryList && data.status === "DELIVERED" && (
                <button className="btn btn-primary" onClick={togglePaymetForm}>
                  Thêm phiếu giao dịch
                </button>
              )}
            </Card.Header>
            {filteredData?.length === 0 ||
            filteredData?.[0]?.debtPayments?.length === 0 ? (
              <strong className="m-2 text-danger">
                Không có lịch sử giao dịch
              </strong>
            ) : (
              <Card.Body>
                <table className="table table-bordered table-striped mt-3">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Ngày giao dịch</th>
                      <th>Người trả tiền</th>
                      <th>Số điện thoại người trả</th>
                      <th>Phương thức thanh toán</th>
                      <th>Số tiền đã trả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData?.[0]?.debtPayments?.map((d, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          {new Date(d?.paymentDate).toLocaleString("vi-VN")}
                        </td>
                        <td>{data.address?.recipientName}</td>
                        <td>{data.address?.phone}</td>
                        <td>
                          {data.paymentMethod !== "COD"
                            ? "Thanh toán khi nhận hết hàng"
                            : "Trả góp"}
                        </td>
                        <td>{d?.amountPaid.toLocaleString()} VND</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Body>
            )}
          </Card>
          <div
            className="mt-5"
            style={{ fontWeight: "bold", marginTop: "10px" }}
          >
            Tổng tiền toàn bộ đơn hàng:{" "}
            <strong className="text-danger">
              {data.orderDetails
                ?.reduce(
                  (sum, detail) =>
                    sum + detail.quantity * detail.productSku.sellingPrice,
                  0
                )
                .toLocaleString()}{" "}
              VND
            </strong>
          </div>
          {/* Trạng thái và nút hành động */}
          {!fromDeliveryList && (
            <div className="row mt-5">
              <div className="col-12 align-items-center mb-2">
                <strong>Trạng thái đơn hàng</strong>
                <div className="d-flex flex-wrap m-2">
                  {data.status === "DELIVERED" ? (
                    <button className="btn btn-secondary m-1" disabled>
                      {statusTranslations["DELIVERED"]}
                    </button>
                  ) : (
                    (() => {
                      let filteredOptions = [];

                      if (
                        data.status === "PENDING" ||
                        data.status === "FINDINGTRUCK"
                      ) {
                        filteredOptions = ["ACCEPTED", "CANCELLED"];
                      } else if (data.status === "ACCEPTED") {
                        filteredOptions = ["DELIVERING", "DELIVERED"];
                      } else if (data.status === "DELIVERING") {
                        filteredOptions = ["DELIVERED"];
                      } else if (data.status === "CANCELLED") {
                        filteredOptions = ["CANCELLED"];
                      } else {
                        filteredOptions = statusOptions;
                      }

                      return filteredOptions?.map((status) => {
                        const isDelivered = status === "DELIVERED";
                        const notEnoughDelivery =
                          isDelivered &&
                          totalDeliveredQuantity < totalOrderQuantity;

                        return (
                          <button
                            key={status}
                            className={`btn m-1 ${
                              status === data.status
                                ? "btn-secondary"
                                : status === "CANCELLED" ||
                                  status === "DELIVERED"
                                ? "btn-danger"
                                : "btn-success"
                            }`}
                            disabled={
                              status === data.status || notEnoughDelivery
                            }
                            onClick={() =>
                              !notEnoughDelivery &&
                              handleStatusChange(data.id, status)
                            }
                          >
                            {statusTranslations[status]}
                          </button>
                        );
                      });
                    })()
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Popup xác nhận */}
          <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Xác nhận thay đổi trạng thái</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Bạn có chắc muốn đổi trạng thái đơn hàng không?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={confirmStatusChange}>
                Xác nhận
              </Button>
              <Button variant="danger" onClick={() => setShowPopup(false)}>
                Hủy
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal cảnh báo trước khi giao hàng */}
          <Modal
            show={showConfirm}
            onHide={() => setShowConfirm(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Chú ý</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Bạn cần in phiếu giao hàng trước khi chuyển sang trạng thái "Đã
              giao".
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={confirmStatusChange}>
                Xác nhận
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setShowConfirm(false);
                  setShowPopup(false);
                }}
              >
                Hủy
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal thanh toán */}
          <Modal
            show={showPaymentPopup}
            onHide={() => setShowPaymentPopup(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Xác nhận thanh toán</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Số tiền đơn hàng</Form.Label>
                <Form.Control
                  type="number"
                  value={data.totalAmount || 0}
                  readOnly
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Số tiền người mua đã thanh toán</Form.Label>
                <Form.Control
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowPaymentPopup(false)}
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (paymentAmount > data.totalAmount) {
                    alert(
                      "Số tiền thanh toán không được vượt quá tổng tiền đơn hàng."
                    );
                    return;
                  }

                  if (paymentAmount < data.totalAmount) {
                    confirmPaymentAndCreateInvoice();
                  } else {
                    confirmStatusChange();
                  }
                }}
              >
                Xác nhận
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal thanh toán */}
          <Modal
            show={showNotePopup}
            onHide={() => setShowNotePopup(false)}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Chi tiết lịch sử giao hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedNote ? (
                <>
                  <Card className="mt-4">
                    <Card.Header>
                      <strong>Thông tin đơn hàng</strong>
                    </Card.Header>
                    <Card.Body>
                      <div className="row">
                        {/* Cột trái */}
                        <div className="col-md-4 mb-2">
                          <div className="mb-2 d-flex align-items-center">
                            <strong className="me-2">Mã đơn hàng:</strong>
                            <span className="text-muted">{data.orderCode}</span>
                          </div>
                          <div className="mb-2 d-flex align-items-center">
                            <strong className="me-2">Người nhận:</strong>
                            <strong className="text-danger">
                              {data.address?.recipientName}
                            </strong>
                          </div>
                        </div>

                        {/* Cột giữa */}
                        <div className="col-md-4 mb-2">
                          <div className="mb-2 d-flex align-items-center">
                            <strong className="me-2">Ngày tạo:</strong>
                            <span className="text-muted">
                              {new Date(data.createdAt).toLocaleString("vi-VN")}
                            </span>
                          </div>
                          <div className="mb-2 d-flex align-items-center">
                            <strong className="me-2">
                              Số điện thoại người nhận:
                            </strong>
                            <span className="text-muted">
                              {data.address?.phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Địa chỉ giao */}
                      <div className="row">
                        <div className="col-12 d-flex align-items-center mb-2">
                          <strong className="me-2">
                            Địa chỉ nhận hàng tại kho:
                          </strong>
                          <span className="text-muted">
                            {`${data.address?.address}, ${data.address?.ward}, ${data.address?.province}`}
                          </span>
                        </div>
                      </div>

                      {/* Phương thức thanh toán */}
                      <div className="row">
                        <div className="col-12 d-flex align-items-center mb-2">
                          <strong className="me-2">Phương thức:</strong>
                          <span className="text-danger text-decoration-underline">
                            {data.paymentMethod !== "COD"
                              ? "Thanh toán khi đã nhận hàng"
                              : "Thanh toán khi đã nhận hàng"}
                          </span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                  <Card className="mt-2">
                    <Card.Header>
                      <strong>Danh sách sản phẩm</strong>
                    </Card.Header>
                    <Card.Body>
                      <table className="table table-bordered table-striped mt-3">
                        <thead>
                          <tr>
                            <th>STT</th>
                            {/* <th>Ảnh sản phẩm</th> */}
                            <th>Tên sản phẩm</th>
                            <th>Đơn giá</th>
                            {/* <th>Đơn vị</th> */}
                            <th>Số lượng</th>
                            <th>Số tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {noteDetails?.deliveryDetails?.map((detail, idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              {/* <td>
                                <img
                                  src={detail.productSku.images}
                                  alt=""
                                  style={{ height: "50px", width: "50px" }}
                                />
                              </td> */}
                              <td>{detail.productSKUCode}</td>
                              <td>{detail.price.toLocaleString()} VND</td>
                              <td>{detail.quantity}</td>
                              <td>
                                {(
                                  detail.quantity * detail.price
                                ).toLocaleString()}{" "}
                                VND
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div style={{ fontWeight: "bold", marginTop: "10px" }}>
                        Tổng tiền:{" "}
                        <strong className="text-danger">
                          {data.orderDetails
                            ?.reduce(
                              (sum, detail) =>
                                sum +
                                detail.quantity *
                                  detail.productSku.sellingPrice,
                              0
                            )
                            .toLocaleString()}{" "}
                          VND
                        </strong>
                      </div>
                    </Card.Body>
                  </Card>
                </>
              ) : (
                <p>Không có dữ liệu.</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowNotePopup(false)}
              >
                Đóng
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default OrderDetails;
