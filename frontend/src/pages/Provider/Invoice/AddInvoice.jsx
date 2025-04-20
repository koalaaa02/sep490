import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../Utils/config";
import { Card, Modal, Button } from "react-bootstrap";

const AddInvoice = ({ orderData, closeAddInvoice, onInvoiceCreated }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [invoice, setInvoice] = useState({
    invoiceId: orderData?.orderCode || "",
    createdDate: orderData?.createdAt || "",
    customer: orderData?.address?.recipientName || "",
    totalAmount: orderData?.totalAmount || "",
    address: orderData?.address?.address || "",
    phone: orderData?.address?.phone || "",
    status: orderData?.status || "",
    deliveryDate: "",
    shopName: orderData?.shop?.name || "",
    shopTin: orderData?.shop?.tin || "",
  });

  const statusTranslations = {
    PENDING: "Đang chờ",
    CANCELLED: "Hủy",
    FINDINGTRUCK: "Đang tìm xe",
    ACCEPTED: "Chấp nhận",
    PACKAGING: "Đóng gói",
    DELIVERING: "Đang giao",
    DELIVERED: "Đã giao",
  };

  const [products, setProducts] = useState(
    orderData?.orderDetails.map((item) => ({
      productName: item.productSku?.skuCode || "",
      quantity: item.quantity || "",
      price: item.price || "",
      imageUrl: item.productSku?.images || "",
      productSkuId: item.id?.skuId || item.productSku?.id || null,
      isEditable: false,
      maxQuantity: item.quantity ?? 1,
    })) || [
      {
        productName: "",
        quantity: "",
        price: "",
        imageUrl: "",
      },
    ]
  );

  const handleConfirm = () => {
    setShowConfirm(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirm(false);
    createDeliveryNote();
  };

  useEffect(() => {
    setInvoice({
      invoiceId: orderData?.orderCode || "",
      createdDate:
        new Date(orderData?.createdAt).toLocaleDateString("vi-VN") || "",
      customer: orderData?.address?.recipientName || "",
      totalAmount: orderData?.totalAmount || "",
      address: orderData?.address?.address || "",
      phone: orderData?.address?.phone || "",
      status: statusTranslations[orderData?.status] || "",
    });

    setProducts(
      orderData?.orderDetails.map((item) => ({
        productName: item.productSku?.skuCode || "",
        productSKUCode: item.productSku?.skuCode || "",
        quantity: item.quantity || "",
        price: item.price || "",
        imageUrl: item.productSku?.images || "",
        isEditable: false,
        maxQuantity: item.quantity ?? 1,
      })) || [{ productName: "", quantity: "", price: "", imageUrl: "" }]
    );
  }, [orderData]);

  const handleInvoiceChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const newProducts = [...products];

    if (name === "quantity") {
      let qty = parseInt(value, 10);
      const max = newProducts[index].maxQuantity;

      if (isNaN(qty) || qty < 1) {
        qty = 1;
      }

      if (qty > max) {
        alert(`Số lượng tối đa cho sản phẩm này là ${max}.`);
        qty = max;
      }

      newProducts[index][name] = qty;
    } else {
      newProducts[index][name] = value;
    }

    setProducts(newProducts);
  };
  const createDeliveryNote = async () => {
    if (!invoice.deliveryDate) {
      alert("Vui lòng nhập ngày giao hàng trước khi tạo phiếu.");
      return;
    }

    const token = localStorage.getItem("access_token");

    const totalAmount = products.reduce((sum, p) => {
      const price = parseFloat(p.price) || 0;
      const qty = parseInt(p.quantity) || 0;
      return sum + price * qty;
    }, 0);

    const deliveryNotePayload = {
      deliveredDate: new Date(invoice.deliveryDate).toISOString(),
      totalAmount,
      delivered: false,
      paid: false,
      orderId: orderData.id,
      deliveryDetails: [], // bỏ qua ở bước tạo
    };

    try {
      // 1. Gửi yêu cầu tạo phiếu giao hàng
      const res = await fetch(`${BASE_URL}/api/provider/deliverynotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(deliveryNotePayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Tạo phiếu giao hàng thất bại!");
      }

      const deliveryNoteResult = await res.json();
      const deliveryNoteId = deliveryNoteResult.id;

      // 2. Map SKU ID đúng từ orderDetails
      const skuMap = new Map();
      orderData.orderDetails.forEach((item) => {
        const skuId = item.id?.skuId;
        const skuCode = item.productSku?.skuCode;
        if (skuId && skuCode) {
          skuMap.set(skuCode, skuId);
        }
      });

      // 3. Gửi từng chi tiết sản phẩm
      for (const product of products) {
        const skuCode = product.productName;
        const matchedSkuId = skuMap.get(skuCode);

        if (!matchedSkuId) {
          console.warn("Không tìm thấy SKU ID cho sản phẩm:", skuCode);
          continue; // bỏ qua sản phẩm nếu không tìm được skuId
        }

        const detailPayload = {
          productName: product.productName,
          productSKUCode: skuCode,
          unit: product.unit || "Cái",
          quantity: product.quantity || 1,
          price: product.price || 0,
          deliveryNoteId: deliveryNoteId,
          orderDetailId: {
            orderId: orderData.id,
            skuId: matchedSkuId,
          },
        };

        const detailRes = await fetch(
          `${BASE_URL}/api/provider/deliverydetails`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(detailPayload),
          }
        );

        if (!detailRes.ok) {
          const errorData = await detailRes.json();
          console.error("Lỗi tạo chi tiết giao hàng:", errorData);
        }
      }

      alert("Tạo phiếu và chi tiết giao hàng thành công!");

      if (typeof onInvoiceCreated === "function") {
        await onInvoiceCreated();
      }
      closeAddInvoice();
    } catch (err) {
      console.error("Lỗi:", err);
      alert(err.message);
    }
  };

  return (
    <div className="p-3 mb-10 container">
      <h4>Tạo phiếu giao hàng</h4>
      <form>
        <div className="border p-3 mb-3">
          <h5>Thông tin</h5>
          <div className="row">
            <div className="col-md-6 mb-2">
              <strong className="me-2">Mã hóa đơn:</strong>
              <span>{invoice.invoiceId}</span>
            </div>
            <div className="row mb-2">
              {/* Cột: Khách hàng */}
              <div className="col-md-5 d-flex align-items-center">
                <strong style={{ minWidth: "120px" }}>Người nhận:</strong>
                <input
                  type="text"
                  name="customer"
                  className="form-control"
                  value={invoice.customer}
                />
              </div>

              {/* Cột: Ngày giao hàng */}
              <div className="col-md-7 d-flex align-items-center">
                <strong className="me-2" style={{ minWidth: "160px" }}>
                  Ngày giao hàng:
                </strong>
                <input
                  type="date"
                  name="deliveryDate"
                  className="form-control"
                  value={invoice.deliveryDate}
                  onChange={handleInvoiceChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6 mb-2 d-flex align-items-center">
              <strong style={{ minWidth: "120px" }}>Số điện thoại:</strong>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={invoice.phone}
              />
            </div>
            <div className="col-md-12 mb-2 d-flex align-items-center">
              <strong style={{ minWidth: "200px" }}>
                Địa chỉ nhận hàng tại kho:
              </strong>
              <input
                type="text"
                name="address"
                className="form-control"
                value={invoice.address}
              />
            </div>
            <div className="col-md-12 mb-2">
              <strong>Phương thức thanh toán:</strong>
              <span className="ms-2 text-danger text-decoration-underline">
                Thanh toán khi nhận hàng
              </span>
            </div>
          </div>
        </div>

        <Card className="mt-2">
          <Card.Header>
            <strong>Chi tiết đơn hàng</strong>
          </Card.Header>

          <Card.Body>
            {/* Thông tin nhà cung cấp */}
            <div className="row mb-3">
              <div className="col-md-6 d-flex align-items-center mb-2">
                <strong className="me-2">Tên nhà cung cấp:</strong>
                <span className="text-muted">{orderData?.shop.name}</span>
              </div>
              <div className="col-md-6 d-flex align-items-center mb-2">
                <strong className="me-2">Mã số thuế:</strong>
                <span className="text-muted">{orderData?.shop.tin}</span>
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Ảnh sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt="product"
                          className="img-thumbnail"
                          style={{
                            height: "50px",
                            width: "50px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <span className="text-muted">Không có ảnh</span>
                      )}
                    </td>
                    <td>{product.productName}</td>
                    <td>
                      <input
                        type="number"
                        name="quantity"
                        className="form-control"
                        value={product.quantity}
                        min={1}
                        max={product.maxQuantity}
                        onChange={(e) => handleProductChange(index, e)}
                      />
                    </td>

                    <td>{Number(product.price).toLocaleString()} VND</td>
                    <td>
                      {(product.quantity * product.price).toLocaleString()} VND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tổng tiền */}
            <div style={{ fontWeight: "bold", marginTop: "10px" }}>
              Tổng tiền:{" "}
              <strong className="text-danger">
                {products
                  .reduce(
                    (total, product) =>
                      total + product.quantity * product.price,
                    0
                  )
                  .toLocaleString()}{" "}
                VND
              </strong>
            </div>
          </Card.Body>
        </Card>

        <div className="text-end mt-6">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={closeAddInvoice}
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleConfirm}
          >
            Tạo phiếu giao hàng
          </button>
        </div>
      </form>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận tạo phiếu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn thông tin trên phiếu giao hàng là chính xác cho đơn
          hàng <strong>{invoice.invoiceId}</strong> không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleConfirmSubmit}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddInvoice;
