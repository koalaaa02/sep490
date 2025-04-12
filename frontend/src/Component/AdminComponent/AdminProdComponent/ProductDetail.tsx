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
              <div className="mb-3">
                <strong>ID:</strong> {product.id}
              </div>
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
                <strong>Đơn vị tính:</strong> {product.unit || "N/A"}
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
                <strong>Người tạo:</strong> {product.createdBy}
              </div>
              <div className="mb-3">
                <strong>Ngày cập nhật:</strong>{" "}
                {new Date(product.updatedAt).toLocaleString()}
              </div>
              <div className="mb-3">
                <strong>Người cập nhật:</strong> {product.updatedBy}
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
                  <div>
                    <strong>ID:</strong> {product.category?.id}
                  </div>
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
                  <div>
                    <strong>ID:</strong> {product.supplier?.id}
                  </div>
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
