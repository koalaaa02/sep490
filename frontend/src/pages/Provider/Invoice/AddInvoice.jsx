import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AddInvoice = ({ orderData, closeAddInvoice }) => {
  const [invoice, setInvoice] = useState({
    invoiceId: orderData?.orderCode || "",
    createdDate: orderData?.createdAt || "",
    customer: orderData?.address?.recipientName || "",
    totalAmount: orderData?.totalAmount || "",
    address: orderData?.address?.address || "",
    phone: orderData?.address?.phone || "",
    status: orderData?.status || "",
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
    })) || [{ productName: "", quantity: "", price: "" }]
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
        isEditable: false,
      })) || [{ productName: "", quantity: "", price: "" }]
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

  const addProduct = () => {
    setProducts([
      ...products,
      { productName: "", quantity: "", price: "", isEditable: true },
    ]);
  };

  const removeProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Hóa đơn đã được lưu!");
  };

  const generateExcelFile = () => {
    const productsData = products.map((product) => [
      product.productName,
      product.quantity,
      product.price,
    ]);

    const invoiceData = [
      ["Mã hóa đơn", invoice.invoiceId],
      ["Ngày tạo", invoice.createdDate],
      ["Khách hàng", invoice.customer],
      ["Địa chỉ", invoice.address],
      ["Số điện thoại", invoice.phone],
      ["Tổng tiền", invoice.totalAmount],
      ["Trạng thái", invoice.status],
    ];

    const combinedData = [
      ...invoiceData,
      [],
      ["Danh sách sản phẩm"],
      ["Tên sản phẩm", "Số lượng", "Giá thành"],
      ...productsData,
      [],
      ["Ghi chú:"],
      [
        " - Đề nghị Quý khách kiểm tra hàng khi nhận hàng ký xác nhận và thanh toán.",
      ],
      [
        " - Chứng từ này là căn cứ để đối chiếu hàng hóa và công nợ phát sinh.",
      ],
      [
        " - Có nhầm lẫn vui lòng báo lại trong 48h kể từ khi nhận hàng.",
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(combinedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hóa đơn");
    const excelFile = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelFile], { type: "application/octet-stream" });
    saveAs(blob, `PhiếuGiaoHàng-${invoice.invoiceId}.xlsx`);
  };

  return (
    <div className="p-3 mb-10">
      <h3>In phiếu giao hàng</h3>
      <form onSubmit={handleSubmit}>
        <div className="border p-3 mb-3">
          <h5>Thông tin</h5>
          <div className="row">
            {[
              { label: "Mã hóa đơn", name: "invoiceId" },
              { label: "Ngày tạo", name: "createdDate" },
              { label: "Khách hàng", name: "customer" },
              { label: "Tổng tiền", name: "totalAmount", type: "number" },
              { label: "Địa chỉ", name: "address" },
              { label: "Số điện thoại", name: "phone" },
              { label: "Trạng thái", name: "status" },
            ].map(({ label, name, type = "text" }, index) => (
              <div className="col-md-6 mb-2" key={index}>
                <label>{label}:</label>
                <input
                  type={type}
                  name={name}
                  className="form-control"
                  value={invoice[name]}
                  onChange={handleInvoiceChange}
                  disabled
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border p-3 mb-3">
          <h5>
            Sản phẩm
            <button
              type="button"
              className="btn btn-sm btn-primary ms-2"
              onClick={addProduct}
            >
              <FaPlus />
            </button>
          </h5>
          {products.map((product, index) => (
            <div key={index} className="border p-2 mb-2">
              <div className="row">
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
                <div className="col-md-12 text-end">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removeProduct(index)}
                    disabled={product.isEditable}
                  >
                    Xóa sản phẩm
                  </button>
                </div>
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
            onClick={generateExcelFile}
          >
            In Excel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInvoice;
