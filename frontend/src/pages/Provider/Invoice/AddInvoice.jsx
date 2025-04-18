import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../Utils/config";
import {Form } from "react-bootstrap";

const AddInvoice = ({ orderData, closeAddInvoice }) => {
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
    })) || [
      {
        productName: "",
        quantity: "",
        price: "",
        imageUrl: "",
      },
    ]
  );

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
        quantity: item.quantity || "",
        price: item.price || "",
        imageUrl: item.productSku?.images || "",
        isEditable: false,
      })) || [{ productName: "", quantity: "", price: "", imageUrl: "" }]
    );
  }, [orderData]);

  const handleInvoiceChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index, e) => {
    const newProducts = [...products];
    newProducts[index][e.target.name] = e.target.value;
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

    const body = {
      deliveredDate: new Date(invoice.deliveryDate).toISOString(),
      totalAmount,
      delivered: false,
      paid: false,
      orderId: orderData.id,
      deliveryDetails: orderData.orderDetails.map((item) => ({
        productName: item.productSku?.productName || "",
        productSKUCode: item.productSku?.skuCode || "",
        unit: item.productSku?.unit || "Cái",
        quantity: item.quantity,
        price: item.price,
        deliveryNoteId: 0,
        orderDetailId: {
          orderId: orderData.id,
          skuId: item.productSku?.id,
        },
      })),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/provider/deliverynotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Tạo phiếu giao hàng thất bại!");

      const result = await res.json();
      alert("Tạo phiếu giao hàng thành công!");
      const printWindow = window.open("/in-phieu.html", "_blank");
      printWindow.onload = () => {
        printWindow.postMessage(
          {
            ...orderData,
            deliveryDate: invoice.deliveryDate,
          },
          window.location.origin
        );
      };
      closeAddInvoice();
    } catch (err) {
      console.error("Lỗi:", err);
      alert("Có lỗi xảy ra khi tạo phiếu giao hàng!");
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
              <label>Mã hóa đơn:</label>
              <input
                type="text"
                name="invoiceId"
                className="form-control"
                value={invoice.invoiceId}
                disabled
              />
            </div>
            <div className="col-md-6 mb-2">
              <label>Ngày tạo:</label>
              <input
                type="text"
                name="createdDate"
                className="form-control"
                value={invoice.createdDate}
                disabled
              />
            </div>
            <div className="col-12 mb-2">
              <label>Khách hàng:</label>
              <input
                type="text"
                name="customer"
                className="form-control"
                value={invoice.customer}
                disabled
              />
            </div>
            <div className="col-md-6 mb-2">
              <label>Tổng tiền:</label>
              <input
                type="number"
                name="totalAmount"
                className="form-control"
                value={invoice.totalAmount}
                disabled
              />
            </div>
            <div className="col-md-6 mb-2">
              <label>Số điện thoại:</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={invoice.phone}
                disabled
              />
            </div>
            <div className="col-12 mb-2">
              <label>Địa chỉ:</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={invoice.address}
                disabled
              />
            </div>
            <div className="col-md-6 mb-2">
              <label>Trạng thái:</label>
              <input
                type="text"
                name="status"
                className="form-control"
                value={invoice.status}
                disabled
              />
            </div>
            <div className="col-md-6 mb-2">
              <label>Ngày giao hàng:</label>
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
        </div>

        <div className="border p-3 mb-3">
          <h5>Chi tiết đơn hàng</h5>
          <div className="d-flex flex-column">
            <Form.Group className="mb-3">
              <Form.Label>Tên cửa hàng</Form.Label>
              <Form.Control value={invoice.shopName} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mã số thuế</Form.Label>
              <Form.Control value={invoice.shopTin} readOnly />
            </Form.Group>
          </div>

          <h5>Sản phẩm</h5>
          {products.map((product, index) => (
            <div className="row mb-2">
              <div className="col-md-2 d-flex flex-column align-items-center">
                {product.imageUrl ? (
                  <>
                    <label className="mb-1">Ảnh sản phẩm:</label>
                    <img
                      src={product.imageUrl}
                      alt="product"
                      className="img-thumbnail"
                      style={{ maxHeight: "100px", objectFit: "contain" }}
                    />
                  </>
                ) : (
                  <span className="text-muted">Không có ảnh</span>
                )}
              </div>

              <div className="col-md-9 d-flex">
                {[
                  { label: "Tên sản phẩm", name: "productName" },
                  { label: "Số lượng", name: "quantity", type: "number" },
                  { label: "Giá thành", name: "price", type: "number" },
                ].map(({ label, name, type = "text" }) => (
                  <div className="col-md-4 mb-2" key={name}>
                    <label>{label}:</label>
                    <input
                      type={type}
                      name={name}
                      className="form-control"
                      value={product[name]}
                      onChange={(e) => handleProductChange(index, e)}
                      disabled={!product.isEditable}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-end">
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
            onClick={createDeliveryNote}
          >
            Tạo phiếu giao hàng
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInvoice;
