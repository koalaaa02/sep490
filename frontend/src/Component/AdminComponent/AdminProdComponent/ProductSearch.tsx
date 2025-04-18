import React from "react";
import { InputGroup, Form } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";

interface ProductSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="d-flex justify-content-between mb-4">
      <InputGroup style={{ width: "300px" }}>
        <InputGroup.Text>
          <FiSearch />
        </InputGroup.Text>
        <Form.Control
          placeholder="Tìm sản phẩm..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </InputGroup>
    </div>
  );
};

export default ProductSearch;
