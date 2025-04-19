import React, { useEffect, useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import MyAccountSideBar from "../../Component/MyAccountSideBar/MyAccountSideBar.jsx";
import { BASE_URL } from "../../Utils/config";
import { useSelector } from "react-redux";
import ShopRegistrationForm from "./MyAccountpaymentComponents/ShopRegistrationForm.tsx";
import QRModal from "./MyAccountpaymentComponents/QRModal.tsx";
import {
  showNotification,
  uploadCertificate,
} from "./MyAccountpaymentComponents/utils.ts";

const MyAcconutPaymentMethod = () => {
  const [storeName, setStoreName] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [shopType, setShopType] = useState("ENTERPRISE");
  const [taxCode, setTaxCode] = useState("");
  const [registrationCertificate, setRegistrationCertificate] = useState(null);
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
  const [loaderStatus, setLoaderStatus] = useState(true);

  const token = useSelector((state) => state.auth.token);

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
        setAccount(data);
      } catch (error) {
        console.error("Lỗi khi fetch API:", error);
      } finally {
        setLoaderStatus(false);
      }
    };

    fetchData();
  }, [token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.(jpeg|jpg|png)")) {
        showNotification(
          setNotification,
          "Vui lòng chọn file ảnh (JPEG, JPG hoặc PNG)",
          "danger"
        );
        return;
      }
      setRegistrationCertificate(file);
    }
  };

  const handleSubmit = async () => {
    // event.preventDefault();

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

    try {
      const createResponse = await fetch(`${BASE_URL}/api/dealer/shop/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(storeData),
      });

      const createData = await createResponse.json();

      if (!createResponse.ok) {
        const errorMessage =
          createData?.message ||
          "Đã xảy ra lỗi khi tạo cửa hàng, vui lòng thử lại!";
        showNotification(setNotification, errorMessage, "danger");
        return;
      }

      if (registrationCertificate) {
        await uploadCertificate(
          createData.id,
          registrationCertificate,
          token,
          BASE_URL
        );
      }

      showNotification(
        setNotification,
        "Bạn đã đăng ký bán hàng thành công!",
        "success"
      );
      setShowModal(true);
    } catch (err) {
      showNotification(
        setNotification,
        "Có lỗi xảy ra trong quá trình đăng ký",
        "danger"
      );
    }
  };

  if (loaderStatus) {
    return (
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
    );
  }

  return (
    <div>
      <ScrollToTop />
      <div>
        <section>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="mt-10 d-flex justify-content-between align-items-center d-md-none">
                  <h3 className="fs-5 mb-0">Tài khoản</h3>
                </div>
              </div>
              <MyAccountSideBar activeKey={"MyAccountPaymentMethod"} />
              <div className="col-lg-9 col-md-8 col-12">
                <ShopRegistrationForm
                  storeName={storeName}
                  setStoreName={setStoreName}
                  citizenId={citizenId}
                  setCitizenId={setCitizenId}
                  shopType={shopType}
                  setShopType={setShopType}
                  taxCode={taxCode}
                  setTaxCode={setTaxCode}
                  handleFileChange={handleFileChange}
                  handleSubmit={handleSubmit}
                  notification={notification}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <QRModal
        showModal={showModal}
        setShowModal={setShowModal}
        storeName={storeName}
        citizenId={citizenId}
        shopType={shopType}
        taxCode={taxCode}
        account={account}
      />
    </div>
  );
};

export default MyAcconutPaymentMethod;
