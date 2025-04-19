import React from "react";
import { Button, Card, Badge, Row, Col, ListGroup } from "react-bootstrap";
import { FiArrowLeft } from "react-icons/fi";
import { Shop } from "./type.ts";

interface ShopDetailProps {
  shop: Shop;
  onBack: () => void;
  onStatusToggle: (id: number, e: React.MouseEvent) => void;
}

const ShopDetail: React.FC<ShopDetailProps> = ({
  shop,
  onBack,
  onStatusToggle,
}) => {
  function getShop(type: string) {
    switch (type) {
      case "ENTERPRISE":
        return "Doanh Nghiệp Lớn";
      case "BUSINESS":
        return "Doanh Nghiệp Nhỏ";
      default:
        return "Không rõ";
    }
  }
  console.log(shop);

  return (
    <div className="p-4">
      <Button variant="outline-primary" onClick={onBack} className="mb-3">
        <FiArrowLeft /> Quay lại danh sách
      </Button>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Chi tiết nhà cung cấp: {shop.name}</h4>
          <div>
            <Badge bg={shop.close ? "danger" : "primary"}>
              {shop.close ? "Đã đóng cửa" : "Đang mở cửa"}
            </Badge>
          </div>
        </Card.Header>

        <Card.Body>
          <Row>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>Thông tin cơ bản</Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>ID:</strong> {shop.id}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Tên nhà cung cấp:</strong> {shop.name}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Loại nhà cung cấp:</strong>{" "}
                      {getShop(shop.shopType)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Mã số thuế:</strong> {shop.tin || "N/A"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>CMND/CCCD:</strong>{" "}
                      {shop.citizenIdentificationCard || "N/A"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Ngày cập nhật:</strong>{" "}
                      {new Date(shop.updatedAt).toLocaleString()}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Người cập nhật:</strong> {shop.updatedBy}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header>Thông tin chủ nhà cung cấp</Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Tên:</strong> {shop.manager?.name || "N/A"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Email:</strong> {shop.manager?.email || "N/A"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Loại tài khoản:</strong>{" "}
                      {shop.manager?.userType || "N/A"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Trạng thái:</strong>{" "}
                      <Badge
                        bg={shop.manager?.active ? "success" : "secondary"}
                      >
                        {shop.manager?.active ? "Hoạt động" : "Không hoạt động"}
                      </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Vai trò:</strong>{" "}
                      {shop.manager?.roles
                        ?.map((role) => role.name)
                        .join(", ") || "N/A"}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>Địa chỉ nhà cung cấp</Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Địa chỉ:</strong> {shop.address?.address || "N/A"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Tỉnh/Thành phố:</strong>{" "}
                      {shop.address?.province || "N/A"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Quận/Huyện:</strong>{" "}
                      {shop.address?.district || "N/A"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Phường/Xã:</strong> {shop.address?.ward || "N/A"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Mã bưu điện:</strong>{" "}
                      {shop.address?.postalCode || "N/A"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Số điện thoại:</strong>{" "}
                      {shop.address?.phone || "N/A"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Tên người nhận:</strong>{" "}
                      {shop.address?.recipientName || "N/A"}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header>Giấy tờ pháp lý</Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Giấy đăng ký kinh doanh:</strong>
                      {shop.registrationCertificateImages ? (
                        <div className="mt-2">
                          <img
                            alt=""
                            src={shop.registrationCertificateImages}
                            className="img-thumbnail me-2"
                            style={{ maxHeight: "150px" }}
                          />
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header>Thông tin tài chính</Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Tổng phí nợ:</strong>{" "}
                      {shop.totalFeeDueAmount?.toLocaleString() || "0"} VND
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>

        <Card.Footer className="d-flex justify-content-between">
          <div>
            <Button
              variant={shop.active ? "danger" : "success"}
              onClick={(e) => onStatusToggle(shop.id, e)}
              className="me-2"
            >
              {shop.active ? "Dừng hoạt động" : "Kích hoạt"}
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ShopDetail;
