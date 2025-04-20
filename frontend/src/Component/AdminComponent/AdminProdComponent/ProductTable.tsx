import React from "react";
import { Table, Badge } from "react-bootstrap";
interface Product {
  id: number;
  name: string;
  description: string;
  specifications: string;
  unit: string;
  images: string | string[];
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

interface ProductTableProps {
  products: Product[];
  onRowClick: (product: Product) => void;
  onStatusToggle: (id: number, e: React.MouseEvent) => void;
  statusType: "active" | "inactive";
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onRowClick,
  onStatusToggle,
  statusType,
}) => {
  return (
    <Table striped hover responsive className="mt-3">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên sản phẩm</th>
          <th>Phân loại</th>
          <th>Nhà cung cấp</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr
            key={product.id}
            onClick={() => onRowClick(product)}
            style={{ cursor: "pointer" }}
          >
            <td>{index + 1}</td>
            <td>{product.name}</td>
            <td>{product.category.name}</td>
            <td>{product.supplier.name}</td>
            <td>
              <Badge bg={statusType === "active" ? "success" : "secondary"}>
                {statusType === "active" ? "Kích hoạt" : "Ngừng kích hoạt"}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ProductTable;
