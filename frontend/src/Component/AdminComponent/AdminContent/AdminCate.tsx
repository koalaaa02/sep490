import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  InputGroup,
  Modal,
  Dropdown,
  Pagination,
} from "react-bootstrap";
import { BASE_URL } from "../../../Utils/config";
import { FiSearch, FiEdit, FiTrash2 } from "react-icons/fi";

const AdminCate = () => {
  const token = localStorage.getItem("access_token");
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [hasParent, setHasParent] = useState(false);
  const [parentCategoryId, setParentCategoryId] = useState<number>();
  const [rfKey, setRfKey] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Items per page
  const [totalItems, setTotalItems] = useState(0);
  const [currentEditCategory, setCurrentEditCategory] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: currentPage,
          size: itemsPerPage,
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
          result.content.map((c) => ({
            name: c.name,
            id: c.id,
            image: c.images,
            parentName: c?.parentCategoryId,
          }))
        );
        setTotalItems(result.totalElements || 0); // Set total items count
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [rfKey, currentPage, itemsPerPage, token]);

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const createCategory = async ({ name, parent, parentCategoryId }) => {
    try {
      const bodyContent = {
        name: name,
        parent: parent,
      };

      if (parent) {
        bodyContent.parentCategoryId = parentCategoryId;
      }

      const response = await fetch(`${BASE_URL}/api/admin/categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bodyContent),
      });

      if (response.ok) {
        setRfKey(!rfKey);
        setShowModal(false);
        setCategoryName("");
        setHasParent(false);
        setParentCategoryId(undefined);
      } else {
        alert("Error occurred: " + response.statusText);
      }
    } catch (error) {
      alert("An error occurred, please try again");
    }
  };
  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
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
          alert("Category deleted successfully");
        } else {
          alert("Error deleting category: " + response.statusText);
        }
      } catch (error) {
        alert("An error occurred while deleting the category");
      }
    }
  };
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleEditClick = (category) => {
    setCurrentEditCategory(category);
    setShowEditModal(true);
  };
  return (
    <div className="p-4">
      <h2 className="mb-4">Categories List</h2>

      <div className="d-flex justify-content-between mb-4">
        <InputGroup style={{ width: "300px" }}>
          <InputGroup.Text>
            <FiSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Category
        </Button>
      </div>

      <Table striped hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Category Name</th>
            <th>Parent Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category) => (
            <tr key={category.id}>
              <td width={20}>{category.id}</td>
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
              <td>{category.parentName}</td>
              <td>
                {" "}
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditClick(category)}
                >
                  <FiEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <FiTrash2 />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />

            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="parent-switch"
                label="Does this category have a parent?"
                checked={hasParent}
                onChange={(e) => setHasParent(e.target.checked)}
              />
            </Form.Group>

            {hasParent && (
              <Form.Group className="mb-3">
                <Form.Label>Parent Category</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary">
                    {parentCategoryId
                      ? categories.find((cat) => cat.id === parentCategoryId)
                          ?.name || "Select Category"
                      : "Select Category"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {categories.map((category) => (
                      <Dropdown.Item
                        key={category.id}
                        onClick={() => setParentCategoryId(category.id)}
                      >
                        {category.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              createCategory({
                name: categoryName,
                parent: hasParent,
                parentCategoryId: parentCategoryId,
              })
            }
            disabled={!categoryName || (hasParent && !parentCategoryId)}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* You can add your edit form here later */}
          <p>Edit form will be implemented here</p>
          <p>Editing category: {currentEditCategory?.name}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              // Add your update logic here later
              setShowEditModal(false);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminCate;
