import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

const AddInvoice = () => {
  const [invoice, setInvoice] = useState({
    invoiceId: "",
    createdDate: "",
    customer: "",
    totalAmount: "",
    shippingFee: "",
    address: "",
    phone: "",
    status: "",
  });

  const [products, setProducts] = useState([
    { productName: "", quantity: "", price: "" },
  ]);

  const handleInvoiceChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index, e) => {
    const newProducts = [...products];
    newProducts[index][e.target.name] = e.target.value;
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { productName: "", quantity: "", price: "" }]);
  };

  const removeProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Hóa đơn đã được lưu!");
  };

  return (
    <div className="p-3 mb-10 container">
      <h3>Thêm hóa đơn</h3>
      <form onSubmit={handleSubmit}>
        <div className="border p-3 mb-3">
          <h5>Thông tin hóa đơn</h5>
          <div className="row">
            {[
              { label: "Mã hóa đơn", name: "invoiceId" },
              { label: "Ngày tạo", name: "createdDate", type: "date" },
              { label: "Khách hàng", name: "customer" },
              { label: "Tổng tiền", name: "totalAmount", type: "number" },
              { label: "Phí vận chuyển", name: "shippingFee", type: "number" },
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
                  required
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border p-3 mb-3">
          <h5>
            Sản phẩm
            <button type="button" className="btn btn-sm btn-primary ms-2" onClick={addProduct}>
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
                      required
                    />
                  </div>
                ))}
                <div className="col-md-12 text-end">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removeProduct(index)}
                    disabled={products.length === 1}
                  >
                    Xóa sản phẩm
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-end">
          <button type="button" className="btn btn-secondary me-2">
            Hủy bỏ
          </button>
          <button type="submit" className="btn btn-success">
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInvoice;
