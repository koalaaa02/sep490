import React from "react";
import { Button, Card, Badge, Row, Col, Image } from "react-bootstrap";
import { FiArrowLeft } from "react-icons/fi";
interface Product {
  id: number;
  name: string;
  description: string;
  specifications: string;
  unit: string;
  images: string;
  active: boolean;
  category: {
    id: number;
    createdBy: number;
    updatedBy: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    images: string;
    parent: boolean;
    delete: boolean;
  };
  supplier: {
    id: number;
    name: string;
    contactEmail: string;
    phone: string;
    address: string;
    createdBy: number;
    updatedBy: number;
    createdAt: string;
    updatedAt: string;
    delete: boolean;
  };
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  delete: boolean;
}

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onStatusToggle: (id: number, e: React.MouseEvent) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  onStatusToggle,
}) => {
  console.log(product);

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

  return (
    <div className="p-4">
      <Button variant="outline-primary" onClick={onBack} className="mb-3">
        <FiArrowLeft /> Quay lại danh sách
      </Button>

      <Card>
        <Card.Header>
          <h4>Chi tiết sản phẩm: {product.name}</h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              {/* <div className="mb-3">
                <strong>ID:</strong> {product.id}
              </div> */}
              <div className="mb-3">
                <strong>Tên sản phẩm:</strong> {product.name}
              </div>
              <div className="mb-3">
                <strong>Mô tả:</strong> {product.description || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Thông số kỹ thuật:</strong>{" "}
                {product.specifications || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Đơn vị tính:</strong>{" "}
                {convertUnitToVietnamese(product.unit) || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Trạng thái:</strong>{" "}
                <Badge bg={product.active ? "success" : "secondary"}>
                  {product.active ? "Kích hoạt" : "Ngừng kích hoạt"}
                </Badge>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <strong>Ngày tạo:</strong>{" "}
                {new Date(product.createdAt).toLocaleString()}
              </div>

              <div className="mb-3">
                <strong>Ngày cập nhật:</strong>{" "}
                {new Date(product.updatedAt).toLocaleString()}
              </div>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>Phân loại</Card.Header>
                <Card.Body>
                  <div>
                    <strong>Tên:</strong> {product.category?.name}
                  </div>
                  {/* <div>
                    <strong>ID:</strong> {product.category?.id}
                  </div> */}
                  {product.category?.images && (
                    <div className="mt-2">
                      <Image
                        src={product.category.images}
                        alt={product.category.name}
                        thumbnail
                        style={{ maxHeight: "150px" }}
                      />
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>Nhà cung cấp</Card.Header>
                <Card.Body>
                  <div>
                    <strong>Tên:</strong> {product.supplier?.name}
                  </div>
                  {/* <div>
                    <strong>ID:</strong> {product.supplier?.id}
                  </div> */}
                  <div>
                    <strong>Email:</strong> {product.supplier?.contactEmail}
                  </div>
                  <div>
                    <strong>Điện thoại:</strong> {product.supplier?.phone}
                  </div>
                  <div>
                    <strong>Địa chỉ:</strong> {product.supplier?.address}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Card className="mb-3">
            <Card.Header>Cửa hàng</Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="">
                  <Row className="align-items-center">
                    <Col md={6}>
                      <strong>Tên:</strong>{" "}
                      {product.shop?.name || "shop ba con cuu"}
                    </Col>
                    <Col md={6}>
                      <strong>Logo:</strong>{" "}
                      <img
                        src={
                          product.shop?.logoImage ||
                          "https://mybucketsep490.s3.ap-southeast-2.amazonaws.com/1745759062280_133875134764725175.jpg"
                        }
                        alt="Logo"
                        className="ml-2 rounded-circle"
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col md={6}>
                  <strong>ID:</strong> {product.shop?.id || 1}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={6}>
                  <strong>CMND/CCCD:</strong>{" "}
                  {product.shop?.citizenIdentificationCard || "345345"}
                </Col>
                <Col md={6}>
                  <strong>TIN:</strong> {product.shop?.tin || "345345"}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={6}>
                  <strong>Loại cửa hàng:</strong>{" "}
                  {product.shop?.shopType || "ENTERPRISE"}
                </Col>
                <Col md={6}>
                  <strong>Trạng thái:</strong>{" "}
                  {product.shop?.active ? "Đang hoạt động" : "Không hoạt động"}
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6} className="text-center"></Col>
                <Col md={6}>
                  <strong>Giấy chứng nhận đăng ký:</strong>
                  <br />
                  <a
                    href={
                      product.shop?.registrationCertificateImages ||
                      "https://mybucketsep490.s3.ap-southeast-2.amazonaws.com/1745759104701_133862641566207024.jpg"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem tại đây
                  </a>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          {/* <Card className="mt-3">
            <Card.Header>Hình ảnh sản phẩm</Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap gap-2">
                <Image
                  src={product?.images}
                  thumbnail
                  style={{ maxHeight: "150px" }}
                />
              </div>
            </Card.Body>
          </Card> */}
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center">
          <div>
            <Button
              variant={product.active ? "danger" : "success"}
              onClick={(e) => onStatusToggle(product.id, e)}
            >
              {product.active ? "Ngừng kích hoạt" : "Kích hoạt"}
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ProductDetail;
