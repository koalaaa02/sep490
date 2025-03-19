import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Utils/config";

const MyAccountAddress = () => {
  const token = localStorage.getItem("access_token");
  const [formData, setFormData] = useState({
    userId: 30,
    shopId: 0,
    recipientName: "",
    phone: "",
    address: "",
    provinceId: "string",
    districtId: "string",
    wardId: "string",
    province: "",
    district: "",
    ward: "",
    postalCode: "",
    defaultAddress: true,
  });
  const [data, setData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({
    id: "",
    recipientName: "",
    address: "",
    ward: "",
    district: "",
    province: "",
    phone: "",
  });

  const handleEdit = (p, index) => {
    setEditIndex(index);
    setEditData({
      id: p.id,
      recipientName: p.recipientName,
      address: p.address,
      ward: p.ward,
      district: p.district,
      province: p.province,
      phone: p.phone,
    });
  };

  const handleChange = (e) => {
    if (editIndex !== null) {
      setEditData({ ...editData, [e.target.name]: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdate = async () => {
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
          content: prevData.content.map((item) =>
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
      content: prevData.content.map((item, i) => ({
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/");
  };
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
                <div className="col-lg-3 col-md-4 col-12 border-end  d-none d-md-block">
                  <div className="pt-10 pe-lg-10">
                    {/* nav */}
                    <ul className="nav flex-column nav-pills nav-pills-dark">
                      {/* nav item */}
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          aria-current="page"
                          to="/MyAccountOrder"
                        >
                          <i className="fas fa-shopping-bag me-2" />
                          Đơn đặt hàng của bạn
                        </Link>
                      </li>
                      {/* nav item */}
                      <li className="nav-item">
                        <Link className="nav-link" to="/MyAccountSetting">
                          <i className="fas fa-cog me-2" />
                          Cài đặt
                        </Link>
                      </li>
                      {/* nav item */}
                      <li className="nav-item">
                        <Link
                          className="nav-link active"
                          to="/MyAccountAddress"
                        >
                          <i className="fas fa-map-marker-alt me-2" />
                          Địa chỉ
                        </Link>
                      </li>
                      {/* nav item */}
                      <li className="nav-item">
                        <Link className="nav-link" to="/MyAcconutPaymentMethod">
                          <i className="fas fa-credit-card me-2" />
                          Phương thức thanh toán
                        </Link>
                      </li>
                      {/* nav item */}
                      <li className="nav-item">
                        <Link className="nav-link" to="/MyAcconutInvoice">
                          <i className="fas fa-bell me-2" />
                          Hóa đơn của tôi
                        </Link>
                      </li>
                      {/* nav item */}
                      <li className="nav-item">
                        <hr />
                      </li>
                      {/* nav item */}
                      <li className="nav-item">
                        <button className="nav-link " onClick={handleLogOut}>
                          <i className="fas fa-sign-out-alt me-2" />
                          Đăng Xuất
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
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

                            <Link
                              to="#"
                              className="btn btn-outline-warning"
                              data-bs-toggle="modal"
                              data-bs-target="#addAddressModal"
                            >
                              Thêm địa chỉ mới{" "}
                            </Link>
                          </div>
                          {notification && (
                            <p className={`alert alert-${notification.type}`}>
                              {notification.message}
                            </p>
                          )}
                          {!data.content ? (
                            <span className={`alert alert-info`}>
                              Bạn chưa có địa chỉ. Thêm mới địa chỉ ngay
                            </span>
                          ) : (
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                              {data.content.map((p, index) => (
                                <div key={index} className="col">
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
                                          className="form-control mb-2"
                                          name="recipientName"
                                          value={editData.recipientName}
                                          onChange={handleChange}
                                          placeholder="Tên người nhận"
                                        />
                                        <input
                                          className="form-control mb-2"
                                          name="address"
                                          value={editData.address}
                                          onChange={handleChange}
                                          placeholder="Địa chỉ"
                                        />
                                        <input
                                          className="form-control mb-2"
                                          name="ward"
                                          value={editData.ward}
                                          onChange={handleChange}
                                          placeholder="Phường/Xã"
                                        />
                                        <input
                                          className="form-control mb-2"
                                          name="district"
                                          value={editData.district}
                                          onChange={handleChange}
                                          placeholder="Quận/Huyện"
                                        />
                                        <input
                                          className="form-control mb-2"
                                          name="province"
                                          value={editData.province}
                                          onChange={handleChange}
                                          placeholder="Tỉnh/Thành phố"
                                        />
                                        <input
                                          className="form-control mb-2"
                                          name="phone"
                                          value={editData.phone}
                                          onChange={handleChange}
                                          placeholder="Số điện thoại"
                                        />
                                        <div>
                                          <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={handleUpdate}
                                          >
                                            Lưu
                                          </button>
                                          <button
                                            className="btn btn-secondary btn-sm"
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
                                        {p.address}, {p.ward} <br />
                                        {p.district}, {p.province}
                                        <br />
                                        {p.phone}
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
          <div
            className="modal fade"
            id="addAddressModal"
            tabIndex={-1}
            aria-labelledby="addAddressModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body p-6">
                  <div className="d-flex justify-content-between mb-5">
                    <div>
                      <h5 className="h6 mb-1" id="addAddressModalLabel">
                        Địa chỉ vận chuyển mới
                      </h5>
                      <p className="small mb-0">
                        Thêm địa chỉ vận chuyển mới cho giao hàng đơn đặt hàng
                        của bạn.
                      </p>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      />
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-12">
                      <input
                        type="text"
                        className="form-control"
                        name="recipientName"
                        placeholder="Họ và Tên"
                        value={formData.recipientName.trim()}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        placeholder="Số điện thoại"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-4">
                      <input
                        type="text"
                        className="form-control"
                        name="postalCode"
                        placeholder="Mã bưu điện"
                        value={formData.postalCode}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-8">
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        placeholder="Địa chỉ"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="text"
                        className="form-control"
                        name="ward"
                        placeholder="Phường"
                        value={formData.ward}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="text"
                        className="form-control"
                        name="district"
                        placeholder="Huyện"
                        value={formData.district}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        className="form-control"
                        name="province"
                        placeholder="Tỉnh"
                        value={formData.province}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 text-end">
                      <button
                        className="btn btn-outline-warning"
                        type="button"
                        onClick={handleSubmit}
                      >
                        Lưu địa chỉ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default MyAccountAddress;
