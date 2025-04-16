import React from "react";
import { Modal, Row, Col, Image, Button } from "react-bootstrap";

const QRModal = ({
  showModal,
  setShowModal,
  storeName,
  citizenId,
  shopType,
  taxCode,
  account,
}) => {
  return (
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
        </Row>
        <div className="text-danger text-start">
          <p className="fw-bold">Lưu ý</p>
          <ol className="fs-6">
            <li>
              • Vui lòng điền chính xác nội dung chuyển khoản để thực hiện nạp
              tiền tự động.
            </li>
            <li>
              • Không chấp nhận giao dịch nạp tiền từ tài khoản công ty. Chỉ các
              giao dịch được thực hiện từ tài khoản cá nhân, đúng với thông tin
              đã đăng ký với ngân hàng, mới đươc xử lý
            </li>
          </ol>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QRModal;
