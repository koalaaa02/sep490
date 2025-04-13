import React, { useEffect, useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import MyAccountSideBar from "../../Component/MyAccountSideBar/MyAccountSideBar";
import { BASE_URL } from "../../Utils/config";
import { useSelector } from "react-redux";
import { Col, Image, Modal, Row } from "react-bootstrap";

const MyAcconutPaymentMethod = () => {
  const [storeName, setStoreName] = useState("");
  const [addressId, setAddressId] = useState("");
  const [registrationCertificate, setRegistrationCertificate] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [shopType, setShopType] = useState("ENTERPRISE");
  const [taxCode, setTaxCode] = useState("");
  const [secretA, setSecretA] = useState("");
  const [secretB, setSecretB] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [account, setAccount] = useState({
    id: 1,
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    defaultBankAccount: false,
    createdAt: "",
    updatedAt: "",
  });

  const token = useSelector((state) => state.auth.token);

  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/bankaccounts/1`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error(`Lỗi: ${response.status}`);

        const data = await response.json();
        console.log(data);
        setAccount(data);
      } catch (error) {
        console.error("Lỗi khi fetch API:", error);
      }
    };

    fetchData();
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const storeData = {
      name: storeName,
      addressId: 3,
      registrationCertificateImages: "string",
      citizenIdentificationCard: citizenId,
      shopType: shopType,
      active: false,
      close: false,
      totalFeeDueAmount: 0,
      tin: taxCode,
      secretA: "string",
      secretB: "string",
    };
    setShowModal(true);
    try {
      const response = await fetch(`${BASE_URL}/api/dealer/shop/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(storeData),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification("Bạn đã đăng ký bán hàng thành công!", "success");
      } else {
        const errorMessage =
          data?.message || "Đã xảy ra lỗi, vui lòng thử lại!";
        showNotification(errorMessage, "danger");
      }
    } catch (err) {
      setError(
        "Không thể kết nối với máy chủ. Vui lòng kiểm tra lại kết nối mạng."
      );
    }
  };

  return (
    <div>
      <>
        <ScrollToTop />
      </>
      <>
        <div>
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
                <MyAccountSideBar activeKey={"MyAccountPaymentMethod"} />
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
                          {/* heading */}
                          <div className="container">
                            <h2>Đăng ký bán hàng</h2>
                            {notification && (
                              <p className={`alert alert-${notification.type}`}>
                                {notification.message}
                              </p>
                            )}
                            <form onSubmit={handleSubmit}>
                              {/* Tên cửa hàng */}
                              <label>Tên cửa hàng:</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập tên cửa hàng"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                required
                              />

                              {/* Địa chỉ ID */}
                              {/* <label>ID địa chỉ:</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập ID địa chỉ"
                                value={addressId}
                                onChange={(e) => setAddressId(e.target.value)}
                                required
                              /> */}

                              {/* Ảnh giấy phép đăng ký */}
                              {/* <label>Ảnh giấy phép đăng ký:</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập đường dẫn ảnh"
                                value={registrationCertificate}
                                onChange={(e) =>
                                  setRegistrationCertificate(e.target.value)
                                }
                                required
                              /> */}

                              {/* Số CCCD */}
                              <label>CCCD của chủ cửa hàng:</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập số CCCD"
                                value={citizenId}
                                onChange={(e) => setCitizenId(e.target.value)}
                                required
                              />

                              {/* Loại cửa hàng */}
                              <label>Loại cửa hàng:</label>
                              <select
                                className="form-control"
                                value={shopType}
                                onChange={(e) => setShopType(e.target.value)}
                              >
                                <option value="ENTERPRISE">
                                  Doanh nghiệp lớn
                                </option>
                                <option value="BUSINESS">
                                  Doanh nghiệp nhỏ
                                </option>
                              </select>

                              {/* Mã số thuế */}
                              <label>Mã số thuế:</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập mã số thuế"
                                value={taxCode}
                                onChange={(e) => setTaxCode(e.target.value)}
                              />

                              {/* Secret A */}
                              {/* <label>Secret A:</label>
                              <input
                                type="password"
                                className="form-control"
                                placeholder="Nhập Secret A"
                                value={secretA}
                                onChange={(e) => setSecretA(e.target.value)}
                                required
                              /> */}

                              {/* Secret B */}
                              {/* <label>Secret B:</label>
                              <input
                                type="password"
                                className="form-control"
                                placeholder="Nhập Secret B"
                                value={secretB}
                                onChange={(e) => setSecretB(e.target.value)}
                                required
                              /> */}

                              {/* Nút Submit */}
                              <button
                                type="submit"
                                className="btn btn-primary mt-3"
                              >
                                Đăng ký cửa hàng
                              </button>
                            </form>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Quét QR để hoàn tất đăng ký</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Row>
            <Col className="text-start" xs={6}>
              <h5>Thông tin đăng ký:</h5>
              <ul className="list-unstyled">
                <li>
                  <strong>Tên cửa hàng:</strong> {storeName}
                </li>
                <li>
                  <strong>CCCD chủ cửa hàng:</strong> {citizenId}
                </li>
                <li>
                  <strong>Loại cửa hàng:</strong>{" "}
                  {shopType === "ENTERPRISE" ? "Doanh nghiệp" : "Cá nhân"}
                </li>
                <li>
                  <strong>Mã số thuế:</strong> {taxCode}
                </li>
                <li>
                  <strong>Số tiền:</strong> 150.000 VNĐ
                </li>
                <li>
                  <strong>Nội dung chuyển khoản:</strong> MCH2025
                </li>
              </ul>
            </Col>
            <Col xs={6}>
              <Image
                height={350}
                src={`https://img.vietqr.io/image/${account.bankName}-${account.accountNumber}-print.png?amount=150000&addInfo=MCH2025`}
              />
            </Col>
          </Row>{" "}
          <div className="text-danger text-start">
            <p className=" fw-bold">Lưu ý</p>
            <ol className="fs-6">
              <li>
                • Vui lòng điền chính xác nội dung chuyển khoản để thực hiện nạp
                tiền tự động.
              </li>
              <li>
                • Không chấp nhận giao dịch nạp tiền từ tài khoản công ty. Chỉ
                các giao dịch được thực hiện từ tài khoản cá nhân, đúng với
                thông tin đã đăng ký với ngân hàng, mới đươc xử lý
              </li>
            </ol>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Đóng
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyAcconutPaymentMethod;
