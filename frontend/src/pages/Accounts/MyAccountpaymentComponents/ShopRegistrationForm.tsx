import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import UploadCertificate from "./UploadCertificate.tsx";
import { useSelector } from "react-redux";

const ShopRegistrationForm = ({
  storeName,
  setStoreName,
  citizenId,
  setCitizenId,
  shopType,
  setShopType,
  taxCode,
  setTaxCode,
  handleFileChange,
  handleCitizenCardFrontChange,
  handleCitizenCardBackChange,
  handleSubmit,
  notification,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const userInfo = useSelector((state) => state.auth.user);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmSubmit = () => {
    setShowConfirmModal(false);
    handleSubmit();
  };

  // if (userInfo.roles.includes("ROLE_PROVIDER"))
  //   return (
  //     <div className="text-center fs-4 h-25 mt-3">
  //       {" "}
  //       Bạn đã là người bán hàng rồi!!!
  //     </div>
  //   );

  return (
    <div className="p-6 p-lg-10">
      <div className="container">
        <h2>Đăng ký bán hàng</h2>
        {notification && (
          <p className={`alert alert-${notification.type}`}>
            {notification.message}
          </p>
        )}
        <Form onSubmit={handleFormSubmit}>
          {/* Tên cửa hàng */}
          <Form.Group className="mb-3">
            <Form.Label>Tên nhà phân phối:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên nhà phân phối"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
            />
          </Form.Group>

          {/* Số CCCD */}
          <Form.Group className="mb-3">
            <Form.Label>CCCD của chủ nhà phân phối:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập số CCCD"
              value={citizenId}
              onChange={(e) => setCitizenId(e.target.value)}
              required
            />
          </Form.Group>

          {/* CCCD Front Side */}
          <UploadCertificate
            label="Ảnh mặt trước CCCD:"
            accept=".jpg,.jpeg,.png"
            handleFileChange={handleCitizenCardFrontChange}
            apiEndpoint="/api/provider/shops/uploadCitizenIdentityCardUp"
          />

          {/* CCCD Back Side */}
          <UploadCertificate
            label="Ảnh mặt sau CCCD:"
            accept=".jpg,.jpeg,.png"
            handleFileChange={handleCitizenCardBackChange}
            apiEndpoint="/api/provider/shops/uploadCitizenIdentityCardDown"
          />

          {/* Loại cửa hàng */}
          <Form.Group className="mb-3">
            <Form.Label>Loại nhà phân phối:</Form.Label>
            <Form.Select
              value={shopType}
              onChange={(e) => setShopType(e.target.value)}
            >
              <option value="ENTERPRISE">Doanh nghiệp lớn</option>
              <option value="BUSINESS">Doanh nghiệp nhỏ</option>
            </Form.Select>
          </Form.Group>

          {/* Mã số thuế */}
          <Form.Group className="mb-3">
            <Form.Label>Mã số thuế:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập mã số thuế"
              value={taxCode}
              onChange={(e) => setTaxCode(e.target.value)}
            />
          </Form.Group>

          {/* Business License */}
          <UploadCertificate
            label="Giấy phép đăng ký kinh doanh:"
            accept=".jpg,.jpeg,.png"
            handleFileChange={handleFileChange}
            apiEndpoint="/api/provider/shops/uploadRegistrationCertificate"
          />

          <Button variant="primary" type="submit" className="mt-3">
            Đăng ký nhà phân phối
          </Button>
        </Form>
      </div>

      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận thông tin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Mã số thuế: <strong>{taxCode}</strong>
          </p>
          <p className="text-danger fw-semibold">
            Lưu ý: Bạn sẽ không thể sửa lại thông tin này sau khi tạo
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={confirmSubmit}>
            Xác nhận
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShopRegistrationForm;
