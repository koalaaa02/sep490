import React from "react";
import { Pagination } from "react-bootstrap";

interface ShopPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ShopPagination: React.FC<ShopPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <Pagination className="justify-content-center">
      {Array.from({ length: totalPages }, (_, i) => (
        <Pagination.Item
          key={i + 1}
          active={i + 1 === currentPage}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  );
};

export default ShopPagination;
