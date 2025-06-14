import React, { useEffect, useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../Utils/config";
import { useNavigate } from "react-router-dom";
import MyAccountSideBar from "../../Component/MyAccountSideBar/MyAccountSideBar";

const MyAcconutSetting = () => {
  const navigate = useNavigate();

  const [loaderStatus, setLoaderStatus] = useState(true);
  const [userData, setUserData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    citizenIdentificationCard: "",
    citizenIdentificationCardImageUp: "",
    citizenIdentificationCardImageDown: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [editableUser, setEditableUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    citizenIdentificationCard: "",
    citizenIdentificationCardImageUp: "",
    citizenIdentificationCardImageDown: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [cccdVerified, setCccdVerified] = useState(false);
  const [cccdPasswordInput, setCccdPasswordInput] = useState("");
  const [showCccdModal, setShowCccdModal] = useState(false);
  const [hasEnteredCccd, setHasEnteredCccd] = useState(false); // Trạng thái đã nhập CCCD
  const [isUploadingUp, setIsUploadingUp] = useState(false);
  const [isUploadingDown, setIsUploadingDown] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user.uid);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/MyAccountSignIn");
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/myprofile/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
        setEditableUser(data);
        // console.log(editableUser);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoaderStatus(false);
      }
    };

    fetchData();
  }, [token]);

  // Kiểm tra tính hợp lệ của số CCCD
  const isValidCccd = (cccd) => {
    const cccdRegex = /^\d{12}$/; // Kiểm tra 12 chữ số
    return cccdRegex.test(cccd);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Kiểm tra nếu người dùng đã nhập số CCCD và kiểm tra độ dài (12 chữ số)
    if (name === "citizenIdentificationCard") {
      // Nếu chưa nhập hoặc nhập không đủ 12 ký tự, không cần kiểm tra
      if (value === "") {
        setError(""); // Không hiển thị lỗi khi không có CCCD
      } else if (value.length === 12 && !isValidCccd(value)) {
        setError("Số CCCD phải là 12 chữ số và chỉ chứa số.");
      } else {
        setError(""); // Xóa lỗi nếu số CCCD hợp lệ
      }
    }

    setEditableUser((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Nếu người dùng bắt đầu nhập CCCD thì cho phép chỉnh sửa tự do
    if (name === "citizenIdentificationCard" && !hasEnteredCccd) {
      setHasEnteredCccd(true);
    }
  };

  const handleUpdateProfile = async (e) => {
    if (e) e.preventDefault();

    if (
      editableUser.citizenIdentificationCard !==
      userData.citizenIdentificationCard
    ) {
      if (!isValidCccd(editableUser.citizenIdentificationCard)) {
        setError("Số CCCD phải là 12 chữ số và chỉ chứa số.");
        return;
      }
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/myprofile/updateMyProfile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editableUser),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Thông tin đã được cập nhật thành công.");
        setUserData((prevData) => ({
          ...prevData,
          ...editableUser,
        }));
      } else {
        setError(data.message || "Cập nhật thất bại.");
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ.");
    }
  };

  const handleUploadImage = async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);

    const url =
      type === "up"
        ? `${BASE_URL}/api/myprofile/uploadCitizenIdentityCardUp?${userId}`
        : `${BASE_URL}/api/myprofile/uploadCitizenIdentityCardDown?${userId}`;

    try {
      if (type === "up") setIsUploadingUp(true);
      if (type === "down") setIsUploadingDown(true);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (
          data &&
          data.citizenIdentificationCardImageUp &&
          data.citizenIdentificationCardImageDown
        ) {
          if (type === "up") {
            setEditableUser((prev) => ({
              ...prev,
              citizenIdentificationCardImageUp:
                data.citizenIdentificationCardImageUp,
            }));
            setUserData((prev) => ({
              ...prev,
              citizenIdentificationCardImageUp:
                data.citizenIdentificationCardImageUp,
            }));
          } else if (type === "down") {
            setEditableUser((prev) => ({
              ...prev,
              citizenIdentificationCardImageDown:
                data.citizenIdentificationCardImageDown,
            }));
            setUserData((prev) => ({
              ...prev,
              citizenIdentificationCardImageDown:
                data.citizenIdentificationCardImageDown,
            }));
          }
        } else {
          console.error("API response is missing image URL fields");
        }
      } else {
        alert("Không thể tải lên ảnh. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Không thể upload ảnh.");
    } finally {
      if (type === "up") setIsUploadingUp(false);
      if (type === "down") setIsUploadingDown(false);
    }
  };

  const handleCccdPasswordSubmit = () => {
    if (cccdPasswordInput === editableUser.citizenIdentificationCard) {
      setCccdVerified(true);
      setShowCccdModal(false);
      setCccdPasswordInput("");
    } else {
      alert("Số CCCD không đúng!");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/myprofile/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
            confirmNewPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Mật khẩu đã được thay đổi thành công.");
        alert("Mật khẩu đã được thay đổi thành công!");
      } else {
        setError(data || "Đã xảy ra lỗi. Vui lòng thử lại.");
        alert("Đã xảy ra lỗi. Vui lòng thử lại!");
      }
    } catch (err) {
      setError(
        "Không thể kết nối với máy chủ. Vui lòng kiểm tra lại kết nối mạng."
      );
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div>
      <ScrollToTop />
      <section>
        <div className="container">
          <div className="row">
            <MyAccountSideBar activeKey={"MyAccountSetting"} />
            <div className="col-lg-9 col-md-8 col-12">
              {loaderStatus ? (
                <div className="loader-container">
                  <MagnifyingGlass
                    visible={true}
                    height="100"
                    width="100"
                    ariaLabel="magnifying-glass-loading"
                    glassColor="#c0efff"
                    color="#0aad0a"
                  />
                </div>
              ) : (
                <div className="p-6 p-lg-10">
                  <h2 className="mb-0">Cài đặt tài khoản</h2>
                  <h5 className="mb-4 mt-4">Thông tin cá nhân</h5>
                  {message && (
                    <div className="alert alert-success">{message}</div>
                  )}
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="row">
                    <div className="col-lg-5">
                      <form>
                        <div className="mb-3">
                          <label className="form-label">Tên người dùng</label>
                          <input
                            type="text"
                            name="firstName"
                            className="form-control"
                            value={editableUser.firstName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={editableUser.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Số CCCD</label>

                          {isEditing ? (
                            // Nếu đang chỉnh sửa, kiểm tra xem citizenIdentificationCard có khác rỗng hoặc đã được xác thực
                            !userData?.citizenIdentificationCard ||
                            cccdVerified ? (
                              // Nếu không có CCCD hoặc đã xác thực, cho phép chỉnh sửa
                              <input
                                type="text"
                                name="citizenIdentificationCard"
                                className="form-control"
                                onChange={handleInputChange}
                              />
                            ) : (
                              // Nếu có CCCD nhưng chưa xác thực, khóa lại và yêu cầu xác thực
                              <div style={{ position: "relative" }}>
                                <input
                                  type="password"
                                  className="form-control"
                                  value={"************"}
                                  disabled
                                />
                                <i
                                  className="fa fa-eye position-absolute"
                                  style={{
                                    top: "10px",
                                    right: "10px",
                                    cursor: "pointer",
                                    color: "#888",
                                  }}
                                  onClick={() => setShowCccdModal(true)}
                                ></i>
                              </div>
                            )
                          ) : userData?.citizenIdentificationCard ? (
                            // Nếu không phải đang chỉnh sửa, kiểm tra đã có CCCD chưa
                            !cccdVerified ? (
                              // Nếu đã có CCCD nhưng chưa xác thực, khóa lại và yêu cầu xác thực
                              <div style={{ position: "relative" }}>
                                <input
                                  type="password"
                                  className="form-control"
                                  value={"************"}
                                  disabled
                                />
                                <i
                                  className="fa fa-eye position-absolute"
                                  style={{
                                    top: "10px",
                                    right: "10px",
                                    cursor: "pointer",
                                    color: "#888",
                                  }}
                                  onClick={() => setShowCccdModal(true)}
                                ></i>
                              </div>
                            ) : (
                              // Nếu đã xác thực thì hiển thị số CCCD
                              <div style={{ position: "relative" }}>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={editableUser.citizenIdentificationCard}
                                  disabled
                                />
                                <i
                                  className="fa fa-eye-slash position-absolute"
                                  style={{
                                    top: "10px",
                                    right: "10px",
                                    cursor: "pointer",
                                    color: "#888",
                                  }}
                                  onClick={() => setCccdVerified(false)}
                                ></i>
                              </div>
                            )
                          ) : (
                            // Nếu chưa có CCCD thì hiển thị thông báo
                            <p className="fst-italic text-danger">
                              Chưa có số CCCD
                            </p>
                          )}
                        </div>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">
                              Ảnh mặt trước CCCD
                            </label>

                            {isUploadingUp ? (
                              <p className="text-info fst-italic">
                                Đang tải ảnh mặt trước...
                              </p>
                            ) : editableUser?.citizenIdentificationCardImageUp &&
                              editableUser.citizenIdentificationCardImageUp !==
                                "" ? (
                              <div
                                style={{
                                  position: "relative",
                                  width: "fit-content",
                                }}
                              >
                                <img
                                  src={
                                    editableUser.citizenIdentificationCardImageUp +
                                    "?t=" +
                                    Date.now()
                                  }
                                  alt="Mặt trước CCCD"
                                  style={{
                                    width: "100px",
                                    marginTop: "10px",
                                    filter: cccdVerified ? "none" : "blur(8px)",
                                  }}
                                />
                                {!cccdVerified && (
                                  <i
                                    className="fa fa-eye position-absolute"
                                    style={{
                                      top: "10px",
                                      left: "10px",
                                      cursor: "pointer",
                                      color: "white",
                                      background: "rgba(0,0,0,0.5)",
                                      padding: "5px",
                                      borderRadius: "50%",
                                    }}
                                    onClick={() => setShowCccdModal(true)}
                                  />
                                )}
                              </div>
                            ) : (
                              <p className="text-danger fst-italic">
                                Chưa có ảnh CCCD mặt trước
                              </p>
                            )}

                            {isEditing && (
                              <input
                                type="file"
                                accept="image/*"
                                className="form-control mt-2"
                                onChange={(e) =>
                                  handleUploadImage(e.target.files[0], "up")
                                }
                              />
                            )}
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="form-label">
                              Ảnh mặt sau CCCD
                            </label>

                            {isUploadingDown ? (
                              <p className="text-info fst-italic">
                                Đang tải ảnh mặt sau...
                              </p>
                            ) : editableUser?.citizenIdentificationCardImageDown &&
                              editableUser.citizenIdentificationCardImageDown !==
                                "" ? (
                              <div
                                style={{
                                  position: "relative",
                                  width: "fit-content",
                                }}
                              >
                                <img
                                  src={
                                    editableUser.citizenIdentificationCardImageDown +
                                    "?t=" +
                                    Date.now()
                                  }
                                  alt="Mặt sau CCCD"
                                  style={{
                                    width: "100px",
                                    marginTop: "10px",
                                    filter: cccdVerified ? "none" : "blur(8px)",
                                  }}
                                />
                                {!cccdVerified && (
                                  <i
                                    className="fa fa-eye position-absolute"
                                    style={{
                                      top: "10px",
                                      left: "10px",
                                      cursor: "pointer",
                                      color: "white",
                                      background: "rgba(0,0,0,0.5)",
                                      padding: "5px",
                                      borderRadius: "50%",
                                    }}
                                    onClick={() => setShowCccdModal(true)}
                                  />
                                )}
                              </div>
                            ) : (
                              <p className="text-danger fst-italic">
                                Chưa có ảnh CCCD mặt sau
                              </p>
                            )}

                            {isEditing && (
                              <input
                                type="file"
                                accept="image/*"
                                className="form-control mt-2"
                                onChange={(e) =>
                                  handleUploadImage(e.target.files[0], "down")
                                }
                              />
                            )}
                          </div>

                          <div className="d-flex justify-content-start mt-2 gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-success"
                                  onClick={() => {
                                    handleUpdateProfile();
                                    setIsEditing(false);
                                  }}
                                >
                                  Lưu
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary"
                                  onClick={() => {
                                    setEditableUser(userData); // Reset về thông tin gốc
                                    setIsEditing(false);
                                    setError("");
                                    setMessage("");
                                  }}
                                >
                                  Hủy
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setIsEditing(true)}
                              >
                                Chỉnh sửa
                              </button>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <hr className="my-5" />
                  <div className="pe-lg-14">
                    <h5 className="mb-4">Thay đổi mật khẩu</h5>
                    <form onSubmit={handleChangePassword}>
                      <div className="mb-3">
                        <label className="form-label">Mật khẩu hiện tại</label>
                        <input
                          type="password"
                          className="form-control"
                          required
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Mật khẩu mới</label>
                        <input
                          type="password"
                          className="form-control"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Xác nhận mật khẩu mới
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          required
                          value={confirmNewPassword}
                          onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                          }
                        />
                      </div>
                      <button type="submit" className="btn btn-warning">
                        Đổi mật khẩu
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal xác thực CCCD */}
      {showCccdModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác thực CCCD</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCccdModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Nhập số CCCD để xác thực"
                  value={cccdPasswordInput}
                  onChange={(e) => setCccdPasswordInput(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowCccdModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCccdPasswordSubmit}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAcconutSetting;
