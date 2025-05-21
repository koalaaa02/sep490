import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { BASE_URL } from "../../Utils/config";
import { useSelector } from "react-redux";
import MyAccountSideBar from "../../Component/MyAccountSideBar/MyAccountSideBar";
import { Modal, Button, Form } from "react-bootstrap";

const MyAccountAddress = () => {
  const token = sessionStorage.getItem("access_token");
  const userId = useSelector((state) => state.auth.user?.uid || []);
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
  const [data, setData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    userId: userId,
    shopId: "",
    recipientName: "",
    address: "",
    ward: "",
    district: "",
    province: "",
    phone: "",
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await fetch(`${BASE_URL}/api/ghn/provinces`);
      const data = await response.json();
      setProvinces(data);
      console.log(provinces);
    };
    fetchProvinces();
  }, []);
  const handleEdit = (p, index) => {
    setEditIndex(index);
    setEditData({
      id: p.id,
      userId: userId,
      shopId: "",
      recipientName: p.recipientName,
      address: p.address,
      province:
        provinces.find((pv) => pv.ProvinceName === p.province)?.ProvinceID ||
        "",
      district:
        districts.find((dt) => dt.DistrictName === p.district)?.DistrictID ||
        "",
      ward: wards.find((w) => w.WardName === p.ward)?.WardCode || "",
      phone: p.phone,
    });
  };

  const handleClose = () => {
    setShowModal(false);
    setFormErrors({});
  };

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

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (editIndex !== null) {
      if (name === "provinceId") {
        const selectedProvince = provinces.find(
          (province) => province.ProvinceID === Number(value)
        );
        setEditData((prev) => ({
          ...prev,
          provinceId: value,
          province: selectedProvince?.ProvinceName || "",
          districtId: "",
          wardId: "",
          district: "",
          ward: "",
        }));
      } else if (name === "districtId") {
        const selectedDistrict = districts.find(
          (district) => district.DistrictID === Number(value)
        );
        setEditData((prev) => ({
          ...prev,
          districtId: value,
          district: selectedDistrict?.DistrictName || "",
          wardId: "",
          ward: "",
        }));
      } else if (name === "wardId") {
        const selectedWard = wards.find(
          (ward) => ward.WardCode === String(value)
        );
        setEditData((prev) => ({
          ...prev,
          wardId: value,
          ward: selectedWard?.WardName || "",
        }));
      } else {
        setEditData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
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
    }

    if (editIndex !== null) {
      setEditData((prevData) => ({ ...prevData, [name]: value }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    try {
      const response = await fetch(`${BASE_URL}/api/addresses/${editData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(editData),
      });

      const result = await response.json();
      if (response.ok) {
        showNotification("Địa chỉ đã được cập nhật thành công!", "success");

        setData((prevData) => ({
          ...prevData,
          content: prevData?.content?.map((item) =>
            item.id === editData.id ? result : item
          ),
        }));

        setEditIndex(null);
      } else {
        showNotification("Địa chỉ cập nhật thất bại!", "danger");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Đã có lỗi xảy ra, vui lòng thử lại.");
    }
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
        showNotification("Địa chỉ đã được thêm thành công!", "success");
        setData((prevData) => ({
          ...prevData,
          content: [...prevData.content, result],
        }));
        setShowModal(false);
      } else {
        showNotification("Thêm địa chỉ thất bại!", "danger");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Đã có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const deleteAdress = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/addresses/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        showNotification("Địa chỉ đã được xóa!", "success");
      } else {
        showNotification("Xóa địa chỉ thất bại!", "danger");
      }
      setData((prevData) => ({
        ...prevData,
        content: prevData.content.filter((address) => address.id !== deleteId),
      }));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleSetDefaultAddress = async (index) => {
    const selectedId = data.content[index].id;

    setData((prevData) => ({
      ...prevData,
      content: prevData.content?.map((item, i) => ({
        ...item,
        defaultAddress: i === index,
      })),
    }));

    showNotification("Đã đặt địa chỉ mặc định!", "success");

    try {
      await fetch(`${BASE_URL}/api/addresses/setdefault/${selectedId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật server:", error);
    }
  };
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/addresses/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchData();
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
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

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!editData.provinceId) return;
      const res = await fetch(
        `${BASE_URL}/api/ghn/districts?provinceId=${editData.provinceId}`
      );
      const data = await res.json();
      setDistricts(data);
    };
    if (editIndex !== null) fetchDistricts();
  }, [editData.provinceId]);

  useEffect(() => {
    const fetchWards = async () => {
      if (!editData.districtId) return;
      const res = await fetch(
        `${BASE_URL}/api/ghn/wards?districtId=${editData.districtId}`
      );
      const data = await res.json();
      setWards(data);
    };
    if (editIndex !== null) fetchWards();
  }, [editData.districtId]);

  return (
    <div>
      <>
        <ScrollToTop />
      </>
      <>
        <div>
          {/* section */}
          <section>
            {/* container */}
            <div className="container">
              {/* row */}
              <div className="row">
                {/* col */}
                <div className="col-12">
                  <div className="mt-10 d-flex justify-content-between align-items-center d-md-none">
                    {/* heading */}
                    <h3 className="fs-5 mb-0">Tài khoản</h3>
                  </div>
                </div>
                {/* col */}
                <MyAccountSideBar activeKey={"MyAccountAddress"} />
                <div className="col-lg-9 col-md-8 col-12">
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
                        <div className="p-6 p-lg-10">
                          <div className="d-flex justify-content-between mb-6">
                            {/* heading */}
                            <h2 className="mb-0">Địa chỉ</h2>
                            {/* button */}

                            <Button
                              variant="outline-warning"
                              onClick={() => setShowModal(true)}
                            >
                              + Thêm địa chỉ mới
                            </Button>
                          </div>
                          {notification && (
                            <p className={`alert alert-${notification.type}`}>
                              {notification.message}
                            </p>
                          )}
                          {data?.content?.length === 0 ? (
                            <span className={`alert alert-info`}>
                              Bạn chưa có địa chỉ. Thêm mới địa chỉ ngay
                            </span>
                          ) : (
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                              {data?.content?.map((p, index) => (
                                <div key={index} className="col w-30">
                                  <div className="border p-6 rounded-3">
                                    <div className="form-check mb-4">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="flexRadioDefault"
                                        id={`homeRadio${index}`}
                                        defaultChecked={p.defaultAddress}
                                      />
                                      <label
                                        className="form-check-label text-dark fw-semi-bold"
                                        htmlFor={`homeRadio${index}`}
                                      >
                                        Địa chỉ
                                      </label>
                                    </div>

                                    {editIndex === index ? (
                                      <div className="row">
                                        <input
                                          className={`form-control mb-2 ${
                                            formErrors.recipientName
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                          name="recipientName"
                                          value={editData.recipientName}
                                          onChange={handleChange}
                                          placeholder="Tên người nhận"
                                        />
                                        {formErrors.recipientName && (
                                          <div className="invalid-feedback">
                                            {formErrors.recipientName}
                                          </div>
                                        )}

                                        <input
                                          className={`form-control mb-2 ${
                                            formErrors.address
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                          name="address"
                                          value={editData.address}
                                          onChange={handleChange}
                                          placeholder="Địa chỉ"
                                        />
                                        {formErrors.address && (
                                          <div className="invalid-feedback">
                                            {formErrors.address}
                                          </div>
                                        )}

                                        <select
                                          className={`form-control mb-2 ${
                                            formErrors.provinceId
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                          name="provinceId"
                                          value={editData.provinceId}
                                          onChange={handleChange}
                                        >
                                          <option value="">Chọn Tỉnh/TP</option>
                                          {provinces.map((province) => (
                                            <option
                                              key={province.ProvinceID}
                                              value={province.ProvinceID}
                                            >
                                              {province.ProvinceName}
                                            </option>
                                          ))}
                                        </select>
                                        {formErrors.provinceId && (
                                          <div className="invalid-feedback">
                                            {formErrors.provinceId}
                                          </div>
                                        )}

                                        <select
                                          className={`form-control mb-2 ${
                                            formErrors.districtId
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                          name="districtId"
                                          value={editData.districtId}
                                          onChange={handleChange}
                                        >
                                          <option value="">
                                            Chọn Quận/Huyện
                                          </option>
                                          {districts.map((district) => (
                                            <option
                                              key={district.DistrictID}
                                              value={district.DistrictID}
                                            >
                                              {district.DistrictName}
                                            </option>
                                          ))}
                                        </select>
                                        {formErrors.districtId && (
                                          <div className="invalid-feedback">
                                            {formErrors.districtId}
                                          </div>
                                        )}

                                        <select
                                          className={`form-control mb-2 ${
                                            formErrors.wardId
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                          name="wardId"
                                          value={editData.wardId}
                                          onChange={handleChange}
                                        >
                                          <option value="">
                                            Chọn Phường/Xã
                                          </option>
                                          {wards.map((ward) => (
                                            <option
                                              key={ward.WardCode}
                                              value={ward.WardCode}
                                            >
                                              {ward.WardName}
                                            </option>
                                          ))}
                                        </select>
                                        {formErrors.wardId && (
                                          <div className="invalid-feedback">
                                            {formErrors.wardId}
                                          </div>
                                        )}

                                        <input
                                          className={`form-control mb-2 ${
                                            formErrors.phone ? "is-invalid" : ""
                                          }`}
                                          name="phone"
                                          value={editData.phone}
                                          onChange={handleChange}
                                          placeholder="Số điện thoại"
                                        />
                                        {formErrors.phone && (
                                          <div className="invalid-feedback">
                                            {formErrors.phone}
                                          </div>
                                        )}

                                        <div>
                                          <button
                                            className="btn btn-warning btn-sm me-2 mt-4"
                                            onClick={handleUpdate}
                                          >
                                            Lưu
                                          </button>
                                          <button
                                            className="btn btn-secondary btn-sm mt-4"
                                            onClick={() => setEditIndex(null)}
                                          >
                                            Hủy
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="mb-6">
                                        {p.recipientName}
                                        <br />
                                        {p.phone}
                                        <br />
                                        {p.address},
                                        <br />
                                        {p.ward},
                                        <br />
                                        {p.district},
                                        <br />
                                        {p.province}
                                      </p>
                                    )}

                                    {!p.defaultAddresss &&
                                      editIndex !== index && (
                                        <button
                                          className="btn btn-info btn-sm"
                                          onClick={() =>
                                            handleSetDefaultAddress(index)
                                          }
                                        >
                                          Đặt làm mặc định
                                        </button>
                                      )}

                                    {editIndex !== index && (
                                      <div className="mt-4">
                                        <Link
                                          to="#"
                                          className="text-inherit"
                                          onClick={() => handleEdit(p, index)}
                                        >
                                          Sửa
                                        </Link>
                                        <Link
                                          to="#"
                                          className="text-danger ms-3 text-decoration-none"
                                          data-bs-toggle="modal"
                                          data-bs-target="#deleteModal"
                                          onClick={() => setDeleteId(p.id)}
                                        >
                                          Xóa
                                        </Link>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Modal */}
          <div
            className="modal fade"
            id="deleteModal"
            tabIndex={-1}
            aria-labelledby="deleteModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              {/* modal content */}
              <div className="modal-content">
                {/* modal header */}
                <div className="modal-header">
                  <h5 className="modal-title" id="deleteModalLabel">
                    Xóa địa chỉ
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                {/* modal body */}
                <div className="modal-body">
                  <h6>Bạn có chắc là bạn muốn xóa địa chỉ này?</h6>
                </div>
                {/* modal footer */}
                <div className="modal-footer">
                  {/* btn */}
                  <button
                    type="button"
                    className="btn btn-outline-gray-400"
                    data-bs-dismiss="modal"
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => deleteAdress()}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Modal */}
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Địa chỉ vận chuyển mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="mb-0 text-danger">
                Thêm địa chỉ vận chuyển mới cho đơn đặt hàng của bạn.
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
        </div>
      </>
    </div>
  );
};

export default MyAccountAddress;
