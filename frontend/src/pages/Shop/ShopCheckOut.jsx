import React, { useEffect, useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { BASE_URL } from "../../Utils/config";
import img1 from "../../images/glass.jpg";
import Swal from "sweetalert2";
import PaymentMethod from "../../Component/PaymentMethod";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";

const ShopCheckOut = () => {
  const location = useLocation();
  const cartItems = location.state?.selectedShops || [];
  const userId = useSelector((state) => state.auth.user?.uid || []);
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("COD");
  const token = sessionStorage.getItem("access_token");
  const [dataAddress, setDataAddress] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(10);
  const [expandedAddressId, setExpandedAddressId] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [formData, setFormData] = useState({
    id: "",
    userId: userId,
    shopId: "",
    recipientName: "",
    phone: "",
    address: "",
    provinceId: "",
    districtId: "",
    wardId: "",
    province: "",
    district: "",
    ward: "",
    postalCode: "",
    defaultAddress: false,
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await fetch(`${BASE_URL}/api/ghn/provinces`);
      const data = await response.json();
      setProvinces(data);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formData.provinceId) return;
      const response = await fetch(
        `${BASE_URL}/api/ghn/districts?provinceId=${formData.provinceId}`
      );
      const data = await response.json();
      setDistricts(data);
    };
    fetchDistricts();
  }, [formData.provinceId]);

  useEffect(() => {
    const fetchWards = async () => {
      if (!formData.districtId) return;
      const response = await fetch(
        `${BASE_URL}/api/ghn/wards?districtId=${formData.districtId}`
      );
      const data = await response.json();
      setWards(data);
    };
    fetchWards();
  }, [formData.districtId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "provinceId") {
      const selectedProvince = provinces.find(
        (province) => province.ProvinceID === Number(value)
      );
      setFormData((prevData) => ({
        ...prevData,
        provinceId: value,
        province: selectedProvince ? selectedProvince.ProvinceName : "",
      }));
    }

    if (name === "districtId") {
      const selectedDistrict = districts.find(
        (district) => district.DistrictID === Number(value)
      );
      setFormData((prevData) => ({
        ...prevData,
        districtId: value,
        district: selectedDistrict ? selectedDistrict.DistrictName : "",
      }));
    }

    if (name === "wardId") {
      const selectedWard = wards.find(
        (ward) => ward.WardCode === String(value)
      );
      setFormData((prevData) => ({
        ...prevData,
        wardId: value,
        ward: selectedWard ? selectedWard.WardName : "",
      }));
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const navigate = useNavigate();
  const hasBulkyItem = cartItems.some((cart) =>
    cart.items.some((item) => item.productSKUResponse?.bulky === true)
  );
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/addresses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setDataAddress((prevData) => [...(prevData || []), result]);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Đã có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleClose = async () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoaderStatus(true);
        const addressResponse = await fetch(`${BASE_URL}/api/addresses/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!addressResponse.ok)
          throw new Error(`Lỗi API Address: ${addressResponse.status}`);

        const addressData = await addressResponse.json();
        setDataAddress(addressData.content || []);
        setSelectedAddressId(addressData.content[0]?.id || null);
      } catch (error) {
        console.error("Lỗi khi fetch API Address:", error);
      }
      setLoaderStatus(false);
    };

    fetchAddress();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, shop) => {
      return (
        total +
        shop.items.reduce((shopTotal, item) => {
          return (
            shopTotal + item.quantity * item.productSKUResponse.sellingPrice
          );
        }, 0)
      );
    }, 0);
  };

  const convertUnitToVietnamese = (unit) => {
    const unitMap = {
      PCS: "Chiếc",
      KG: "Kilogram",
      PAIR: "Cặp",
      SET: "Bộ",
      PACK: "Gói",
      BAG: "Túi",
      DOZEN: "Chục",
      BOX: "Hộp",
      TON: "Tấn",
    };

    return unitMap[unit] || unit;
  };

  const handleAddressChange = (id) => {
    setSelectedAddressId(id);
  };

  const handleCheckout = async () => {
    try {
      const totalAmount = calculateTotal();
      const productIds = cartItems.flatMap((shop) =>
        shop?.items?.map((item) => item.productSKUId)
      );

      const checkoutData = {
        status: "PENDING",
        shippingFee: 0,
        totalAmount: totalAmount,
        paymentMethod: selectedPayment,
        deliveryMethod: hasBulkyItem ? "SELF_DELIVERY" : "GHN",
        paid: false,
        shopId: cartItems[0]?.shopId || 0,
        addressId: selectedAddressId,
        deliveryCode: "string",
        productIds: productIds,
        commissionFee: 0,
        paymentFee: 0,
        totalPlatformFee: 0,
      };

      const checkoutResponse = await fetch(`${BASE_URL}/api/checkout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      if (!checkoutResponse.ok) {
        throw new Error("Lỗi khi đặt hàng.");
      }

      Swal.fire({
        icon: "success",
        title: "Đặt hàng thành công",
        text: "Bạn đã đặt hàng thành công!",
        showConfirmButton: true,
        timer: 2000,
      });

      navigate("/MyAccountOrder");
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán hoặc đặt hàng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Có lỗi xảy ra, vui lòng thử lại!",
        showConfirmButton: true,
      });
    }
  };

  const toggleAddress = (id) => {
    setExpandedAddressId(expandedAddressId === id ? null : id);
    handleAddressChange(id);
  };

  return (
    <div>
      <div>
        {loaderStatus ? (
          <div className="loader-container">
            {/* <PulseLoader loading={loaderStatus} size={50} color="#0aad0a" /> */}
            <MagnifyingGlass
              visible={true}
              height="100"
              width="100"
              ariaLabel="magnifying-glass-loading"
              wrapperStyle={{}}
              wrapperclassName="magnifying-glass-wrapper"
              glassColor="#c0efff"
              color="#0aad0a"
            />
          </div>
        ) : (
          <>
            <>
              <ScrollToTop />
            </>
            <div className="container mt-4">
              <h4 className="mb-3">Thanh Toán Đơn Hàng</h4>
              <div className="row mb-10">
                {/* Cột bên trái */}
                <div className="col-md-8">
                  {/* Địa chỉ nhận hàng */}
                  <div className="card mb-3">
                    <div className="card-header bg-warning fw-bold text-black d-flex justify-content-between align-items-center">
                      <span>Địa Chỉ Nhận Hàng</span>
                      <Button
                        variant="primary"
                        onClick={() => setShowModal(true)}
                      >
                        Thêm địa chỉ
                      </Button>
                    </div>
                    {dataAddress?.length === 1 ? (
                      <span className="m-2 d-flex justify-content-center">
                        Bạn chưa có địa chỉ. Thêm mới địa chỉ ngay
                      </span>
                    ) : (
                      <div className="card-body">
                        {dataAddress?.map((a) => (
                          <div key={a.id} className="border rounded-1 p-2 mb-2">
                            <div
                              className="d-flex align-items-center"
                              onClick={() => toggleAddress(a.id)}
                              style={{ cursor: "pointer" }}
                            >
                              <input
                                type="radio"
                                checked={selectedAddressId === a.id}
                                onChange={() => toggleAddress(a.id)}
                                className="me-2"
                              />
                              <strong>{a.recipientName}</strong>
                            </div>

                            {expandedAddressId === a.id && (
                              <div className="mt-1">
                                <span>{a.phone}</span> <br />
                                <span>
                                  {a.address}, {a.ward}, {a.district},{" "}
                                  {a.province}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sản phẩm */}
                  <div className="card mb-3 container">
                    <div className="row ">
                      <div className="col-5 card-header fw-bold text-black">
                        Sản phẩm
                      </div>
                      <div className="col-1 card-header text-muted">Đơn vị</div>
                      <div className="col-2 card-header text-muted">
                        Đơn giá
                      </div>
                      <div className="col-2 card-header text-muted">
                        Số lượng
                      </div>
                      <div className="col-2 card-header text-muted">
                        Thành tiền
                      </div>
                    </div>
                    {cartItems?.map((shop) => (
                      <div key={shop.shopId}>
                        {/* Tên cửa hàng */}
                        <div className="d-flex align-items-center mt-1 mb-3 border-bottom pb-3">
                          <span>Tên nhà phân phối: {shop.shopName}</span>
                        </div>

                        {/* Sản phẩm trong cửa hàng */}
                        {shop.items?.map((item) => (
                          <div
                            key={item.productSKUId}
                            className="row border-bottom container"
                          >
                            <div className="row align-items-center m-2 p-2 border border-1 bg-light">
                              {/* Ảnh sản phẩm */}
                              <div className="col-2 text-center">
                                <img
                                  src={item.imageUrl || img1}
                                  alt={item.productName}
                                  className="img-fluid mt-2"
                                  style={{
                                    height: "100px",
                                    width: "100px",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    padding: "2px",
                                  }}
                                />
                              </div>

                              {/* Tên sản phẩm */}
                              <div className="col-3">
                                <h6>Tên sản phẩm: {item.productName}</h6>
                                <p className="text-muted">
                                  {
                                    item.productSKUResponse?.product
                                      ?.unitAdvance
                                  }
                                </p>
                                <p className="text-muted">
                                  Phân loại: {item.productSKUCode}
                                </p>
                              </div>
                              {/* Đơn vị */}
                              <div className="col-1 text-center">
                                <strong className="text-muted">
                                  {convertUnitToVietnamese(
                                    item.productSKUResponse?.product?.unit
                                  )}
                                </strong>
                              </div>

                              {/* Đơn giá */}
                              <div className="col-2 text-center">
                                <strong className="text-muted">
                                  {item.productSKUResponse.sellingPrice.toLocaleString(
                                    "vi-VN"
                                  )}
                                  đ
                                </strong>
                              </div>

                              {/* Số lượng */}
                              <div className="col-2 text-center">
                                <span className="mx-2">{item.quantity}</span>
                              </div>

                              {/* Số tiền */}
                              <div className="col-2 text-center">
                                <strong className="text-danger">
                                  {(
                                    item.quantity *
                                    item.productSKUResponse.sellingPrice
                                  ).toLocaleString("vi-VN")}
                                  đ
                                </strong>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cột bên phải */}
                <div className="col-md-4">
                  {/* Phương thức thanh toán */}
                  <div className="card mb-3">
                    <div className="card-header bg-warning fw-bold text-black">
                      Phương thức thanh toán
                    </div>
                    <div className="card-body">
                      {/* Trả góp - DEBT */}
                      {/* <div className="form-check border-bottom border-1 pb-3">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="installment"
                          value="DEBT"
                          checked={selectedPayment === "DEBT"}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="installment"
                        >
                          Trả góp
                        </label>
                      </div> */}

                      {/* Thanh toán khi nhận hàng - COD */}
                      <div className="form-check pb-3">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="cod"
                          value="COD"
                          checked={selectedPayment === "COD"}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="cod">
                          Thanh toán khi nhận hàng
                        </label>
                      </div>

                      {/* Thanh toán qua VNPay - VNPAY */}
                      {/* <div className="form-check pt-3">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="vnpay"
                          value="VNPAY"
                          checked={selectedPayment === "VNPAY"}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="vnpay">
                          Thanh toán qua ví VNPay
                        </label>
                      </div> */}

                      {/* Hiển thị PaymentMethod nếu chọn VNPay */}
                      {selectedPayment === "VNPAY" && <PaymentMethod />}
                    </div>
                  </div>
                  <div className="card mb-10">
                    <div className="card-header bg-warning fw-bold text-black">
                      Thanh toán
                    </div>
                    <div className="card-body">
                      <p>
                        <strong>Tiền đơn hàng:</strong>{" "}
                      </p>
                      <input
                        type="text"
                        className="form-control text-end fw-bold"
                        value={
                          (calculateTotal() - paymentAmount).toLocaleString(
                            "vi-VN"
                          ) + " đ"
                        }
                        readOnly
                      />
                      <button
                        className="btn btn-warning w-100 mt-3"
                        onClick={handleCheckout}
                      >
                        Đặt hàng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Modal show={showModal} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Địa chỉ vận chuyển mới</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p className="small mb-0 text-danger">
                  Thêm địa chỉ vận chuyển mới cho giao hàng đơn đặt hàng của
                  bạn.
                </p>
                <Form>
                  <Form.Group controlId="recipientName" className="mb-3">
                    <Form.Label>Tên người nhận:</Form.Label>
                    <Form.Control
                      type="text"
                      name="recipientName"
                      placeholder="Họ và Tên"
                      value={formData.recipientName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="phone" className="mb-3">
                    <Form.Label>Số điện thoại:</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder="Số điện thoại"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <Form.Group
                      controlId="postalCode"
                      className="mb-3"
                      style={{ flex: 1 }}
                    >
                      <Form.Label>Mã bưu điện:</Form.Label>
                      <Form.Control
                        type="text"
                        name="postalCode"
                        placeholder="Mã bưu điện"
                        value={formData.postalCode}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group
                      controlId="address"
                      className="mb-3"
                      style={{ flex: 1 }}
                    >
                      <Form.Label>Địa chỉ:</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        placeholder="Địa chỉ"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </div>

                  <Form.Group controlId="provinceId" className="mb-3">
                    <Form.Label>Tỉnh:</Form.Label>
                    <Form.Control
                      as="select"
                      name="provinceId"
                      value={formData.provinceId}
                      onChange={handleChange}
                    >
                      <option value="">Chọn thành phố</option>
                      {provinces.map((province) => (
                        <option
                          key={province.ProvinceID}
                          value={province.ProvinceID}
                        >
                          {province.ProvinceName}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <Form.Group
                      controlId="districtId"
                      className="mb-3"
                      style={{ flex: 1 }}
                    >
                      <Form.Label>Huyện:</Form.Label>
                      <Form.Control
                        as="select"
                        name="districtId"
                        value={formData.districtId}
                        onChange={handleChange}
                      >
                        <option value="">Chọn huyện</option>
                        {districts.map((district) => (
                          <option
                            key={district.DistrictID}
                            value={district.DistrictID}
                          >
                            {district.DistrictName}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group
                      controlId="wardId"
                      className="mb-3"
                      style={{ flex: 1 }}
                    >
                      <Form.Label>Phường:</Form.Label>
                      <Form.Control
                        as="select"
                        name="wardId"
                        value={formData.WardCode}
                        onChange={handleChange}
                      >
                        <option value="">Chọn phường</option>
                        {wards.map((ward) => (
                          <option key={ward.WardCode} value={ward.WardCode}>
                            {ward.WardName}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </div>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Hủy
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  Lưu địa chỉ
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
};

export default ShopCheckOut;
