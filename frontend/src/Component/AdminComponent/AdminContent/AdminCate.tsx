import React, { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { BASE_URL } from "../../../Utils/config";
import AddCategoryModal from "../AdminCateComponent/AddCategoryModal.tsx";
import EditCategoryModal from "../AdminCateComponent/EditCategoryModal.tsx";
import CategoryTable from "../AdminCateComponent/CategoryTable.tsx";
import CategoryPagination from "../AdminCateComponent/CategoryPagination.tsx";

type CategoryType = {
  id?: number;
  name: string;
  parent: boolean;
  parentCategoryId?: number;
  parentName?: string;
  image?: string;
};

const AdminCate = () => {
  const token = localStorage.getItem("access_token");
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditCategory, setCurrentEditCategory] =
    useState<CategoryType>();
  const [rfKey, setRfKey] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          size: itemsPerPage.toString(),
          sortBy: "id",
          direction: "ASC",
        });
        const response = await fetch(
          `${BASE_URL}/api/admin/categories/?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const result = await response.json();
        setCategories(
          result.content.map((c: any) => ({
            name: c.name,
            id: c.id,
            image: c.images,
            parentName: c?.parentCategory?.name,
          }))
        );
        setTotalItems(result.totalElements || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [rfKey, currentPage, itemsPerPage, token]);

  const filteredCategories = categories.filter((category) =>
    category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xoá danh mục này không?")) {
      try {
        const response = await fetch(`${BASE_URL}/api/admin/categories/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (response.ok) {
          setRfKey(!rfKey);
          alert("Xoá thành công");
        } else {
          alert("Có lỗi xảy ra, vui lòng thử lại " + response.statusText);
        }
      } catch (error) {
        alert("An error occurred while deleting the category");
      }
    }
  };

  const handleEditClick = (category: CategoryType) => {
    setCurrentEditCategory(category);
    setShowEditModal(true);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-center">Danh sách danh mục</h2>

      <div className="d-flex justify-content-between mb-4">
        <InputGroup style={{ width: "300px" }}>
          <InputGroup.Text>
            <FiSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Tìm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          Thêm danh mục mới
        </Button>
      </div>

      <CategoryTable
        categories={filteredCategories}
        onEdit={handleEditClick}
        onDelete={handleDeleteCategory}
      />

      <CategoryPagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalItems / itemsPerPage)}
        onPageChange={handlePageChange}
      />

      <AddCategoryModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        categories={categories}
        onSuccess={() => setRfKey(!rfKey)}
      />

      {currentEditCategory && (
        <EditCategoryModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          category={currentEditCategory}
          categories={categories}
          onSuccess={() => setRfKey(!rfKey)}
        />
      )}
    </div>
  );
};

export default AdminCate;
