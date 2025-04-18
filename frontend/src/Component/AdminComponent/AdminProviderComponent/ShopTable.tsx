import React from "react";
import { Table, Badge } from "react-bootstrap";
import { Shop } from "./type.ts";

interface ShopTableProps {
  shops: Shop[];
  onRowClick: (shop: Shop) => void;
  onStatusToggle: (id: number, e: React.MouseEvent) => void;
  statusType: "active" | "inactive";
}

const ShopTable: React.FC<ShopTableProps> = ({
  shops,
  onRowClick,
  onStatusToggle,
  statusType,
}) => {
  console.log(shops);

  return (
    <Table striped hover responsive className="mt-3">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên nhà cung cấp</th>
          <th>Địa chỉ</th>
          <th>Chủ nhà cung cấp</th>
          <th>Mã số thuế</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {shops.map((shop, index) => (
          <tr
            key={shop.id}
            onClick={() => onRowClick(shop)}
            style={{ cursor: "pointer" }}
          >
            <td>{index + 1}</td>
            <td style={{ color: "blue" }}>
              {shop.name || "Tên nhà cung cấp không hợp lệ"}
            </td>
            <td>{shop.address?.address || "N/A"}</td>
            <td>{shop.manager?.name || "N/A"}</td>
            <td>{shop.tin || "N/A"}</td>
            <td >
              <Badge bg={statusType === "active" ? "success" : "secondary"}>
                {statusType === "active" ? "Hoạt động" : "Dừng hoạt động"}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ShopTable;
