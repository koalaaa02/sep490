import React from "react";
import { Table } from "react-bootstrap";
import { FiEdit, FiTrash2 } from "react-icons/fi";

type CategoryTableProps = {
  categories: Array<{
    id?: number;
    name: string;
    parentName?: string;
    image?: string;
  }>;
  onEdit: (category: any) => void;
  onDelete: (id: number) => void;
};

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  onEdit,
  onDelete,
}) => {
  return (
    <Table striped hover responsive>
      <thead>
        <tr>
          <th>STT</th>
          <th>Ảnh</th>
          <th>Danh mục</th>
          <th>Thuộc danh mục</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category, index) => (
          <tr key={category.id}>
            <td width={20}>{index + 1}</td>
            <td width={200}>
              <img
                height={150}
                width={150}
                className="object-fit-cover"
                src={category.image}
                alt={`${category.name}`}
              />
            </td>
            <td>{category.name}</td>
            <td>{category.parentName || "Không có"}</td>
            <td width={120}>
              <button
                className="btn btn-outline-primary me-2"
                onClick={() => onEdit(category)}
              >
                <FiEdit />
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => category.id && onDelete(category.id)}
              >
                <FiTrash2 />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CategoryTable;
