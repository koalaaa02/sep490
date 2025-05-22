import React, { useEffect, useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { BASE_URL } from "../../Utils/config";
import img1 from "../../images/glass.jpg";
import Swal from "sweetalert2";
import PaymentMethod from "../../Component/PaymentMethod";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";

const ShopCheckOut = () => {
  const location = useLocation();
  const cartItems = location.state?.selectedShops || [];
  const userId = useSelector((state) => state.auth.user?.uid || []);
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("COD");
  const token = sessionStorage.getItem("access_token");
  const [dataAddress, setDataAddress] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [expandedAddressId, setExpandedAddressId] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [formErrors, setFormErrors] = useState({});

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
  const navigate = useNavigate();
  const hasBulkyItem = cartItems.some((cart) =>
    cart.items.some((item) => item.productSKUResponse?.bulky === true)
  );
  const [showModal, setShowModal] = useState(false);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.recipientName.trim())
      errors.recipientName = "Vui lòng nhập tên người nhận";
    if (!formData.phone.trim()) errors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^\d{10,11}$/.test(formData.phone))
      errors.phone = "Số điện thoại không hợp lệ";
    if (!formData.address.trim()) errors.address = "Vui lòng nhập địa chỉ";
    if (!formData.provinceId)
      errors.provinceId = "Vui lòng chọn tỉnh/thành phố";
    if (!formData.districtId) errors.districtId = "Vui lòng chọn quận/huyện";
    if (!formData.wardId) errors.wardId = "Vui lòng chọn phường/xã";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "provinceId") {
      const selectedProvince = provinces.find(
        (province) => province.ProvinceID === Number(value)
      );
      setFormData((prevData) => ({
        ...prevData,
        provinceId: value,
        province: selectedProvince ? selectedProvince.ProvinceName : "",
        districtId: "", // Reset district when province changes
        wardId: "", // Reset ward when province changes
      }));
      setDistricts([]);
      setWards([]);
    }

    if (name === "districtId") {
      const selectedDistrict = districts.find(
        (district) => district.DistrictID === Number(value)
      );
      setFormData((prevData) => ({
        ...prevData,
        districtId: value,
        district: selectedDistrict ? selectedDistrict.DistrictName : "",
        wardId: "", // Reset ward when district changes
      }));
      setWards([]);
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

  const handleSubmit = async () => {
    if (!validateForm()) return;

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
        setDataAddress((prevData) => [...prevData, result]);
        setSelectedAddressId(result.id);
        setShowModal(false);
        // Reset form
        setFormData({
          ...formData,
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
        });
      }
    } catch (error) {
      console.error("Error saving address:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã có lỗi xảy ra, vui lòng thử lại.",
      });
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setFormErrors({});
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
        if (addressData.content?.length > 0) {
          setSelectedAddressId(addressData.content[0].id);
        }
      } catch (error) {
        console.error("Lỗi khi fetch API Address:", error);
      }
      setLoaderStatus(false);
    };

    fetchAddress();
  }, [token]);

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
    if (!selectedAddressId) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng chọn địa chỉ nhận hàng",
      });
      return;
    }

    if (cartItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Giỏ hàng trống",
        text: "Không có sản phẩm nào để thanh toán",
      });
      return;
    }

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
      {loaderStatus ? (
        <div className="loader-container">
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
          <ScrollToTop />
          <div className="container mt-4">
            <h4 className="mb-3">Thanh Toán Đơn Hàng</h4>

            {cartItems.length === 0 ? (
              <div className="alert alert-warning text-center">
                Không có sản phẩm nào trong giỏ hàng để thanh toán
              </div>
            ) : (
              <div className="row mb-10">
                {/* Left Column */}
                <div className="col-md-8">
                  {/* Shipping Address */}
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
                    <div className="card-body">
                      {dataAddress.length === 0 ? (
                        <div className="text-center py-3">
                          <p>Bạn chưa có địa chỉ nào</p>
                          <Button
                            variant="primary"
                            onClick={() => setShowModal(true)}
                          >
                            Thêm địa chỉ mới
                          </Button>
                        </div>
                      ) : (
                        dataAddress.map((a) => (
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
                        ))
                      )}
                    </div>
                  </div>

                  {/* Products */}
                  <div className="card mb-3 container">
                    <div className="row">
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
                    {cartItems.map((shop) => (
                      <div key={shop.shopId}>
                        {/* Shop name */}
                        <div className="d-flex align-items-center mt-1 mb-3 border-bottom pb-3">
                          <span>Tên nhà phân phối: {shop.shopName}</span>
                        </div>

                        {/* Products in shop */}
                        {shop.items.length === 0 ? (
                          <div className="text-center py-3">
                            Không có sản phẩm nào trong cửa hàng này
                          </div>
                        ) : (
                          shop.items.map((item) => (
                            <div
                              key={item.productSKUId}
                              className="row border-bottom container"
                            >
                              <div className="row align-items-center m-2 p-2 border border-1 bg-light">
                                {/* Product image */}
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

                                {/* Product name */}
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
                                {/* Unit */}
                                <div className="col-1 text-center">
                                  <strong className="text-muted">
                                    {convertUnitToVietnamese(
                                      item.productSKUResponse?.product?.unit
                                    )}
                                  </strong>
                                </div>

                                {/* Price */}
                                <div className="col-2 text-center">
                                  <strong className="text-muted">
                                    {item.productSKUResponse.sellingPrice.toLocaleString(
                                      "vi-VN"
                                    )}
                                    đ
                                  </strong>
                                </div>

                                {/* Quantity */}
                                <div className="col-2 text-center">
                                  <span className="mx-2">{item.quantity}</span>
                                </div>

                                {/* Total */}
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
                          ))
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-md-4">
                  {/* Payment Method */}
                  <div className="card mb-3">
                    <div className="card-header bg-warning fw-bold text-black">
                      Phương thức thanh toán
                    </div>
                    <div className="card-body">
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
                        disabled={!selectedAddressId || cartItems.length === 0}
                      >
                        Đặt hàng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Add Address Modal */}
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Địa chỉ vận chuyển mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="small mb-0 text-danger">
                Thêm địa chỉ vận chuyển mới cho giao hàng đơn đặt hàng của bạn.
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
                    isInvalid={!!formErrors.recipientName}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.recipientName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="phone" className="mb-3">
                  <Form.Label>Số điện thoại:</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={handleChange}
                    isInvalid={!!formErrors.phone}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.phone}
                  </Form.Control.Feedback>
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
                      isInvalid={!!formErrors.address}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.address}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <Form.Group controlId="provinceId" className="mb-3">
                  <Form.Label>Tỉnh:</Form.Label>
                  <Form.Control
                    as="select"
                    name="provinceId"
                    value={formData.provinceId}
                    onChange={handleChange}
                    isInvalid={!!formErrors.provinceId}
                    required
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
                  <Form.Control.Feedback type="invalid">
                    {formErrors.provinceId}
                  </Form.Control.Feedback>
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
                      isInvalid={!!formErrors.districtId}
                      required
                      disabled={!formData.provinceId}
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
                    <Form.Control.Feedback type="invalid">
                      {formErrors.districtId}
                    </Form.Control.Feedback>
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
                      value={formData.wardId}
                      onChange={handleChange}
                      isInvalid={!!formErrors.wardId}
                      required
                      disabled={!formData.districtId}
                    >
                      <option value="">Chọn phường</option>
                      {wards.map((ward) => (
                        <option key={ward.WardCode} value={ward.WardCode}>
                          {ward.WardName}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formErrors.wardId}
                    </Form.Control.Feedback>
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
  );
};

export default ShopCheckOut;
