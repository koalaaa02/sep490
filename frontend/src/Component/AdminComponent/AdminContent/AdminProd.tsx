import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  InputGroup,
  Badge,
  Tabs,
  Tab,
  Pagination,
} from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { BASE_URL } from "../../../Utils/config";
interface PaginationState {
  activePage: number;
  inactivePage: number;
  itemsPerPage: number;
  activeTotalPages?: number;
  inactiveTotalPages?: number;
}
const AdminProd = () => {
  const token = localStorage.getItem("access_token");
  const [activeProducts, setActiveProducts] = useState([]);
  const [inactiveProducts, setInactiveProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [rfkey, setRfKey] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    activePage: 1,
    inactivePage: 1,
    itemsPerPage: 5,
  });

  useEffect(() => {
    const fetchProducts = async (activeStatus, page) => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          size: String(pagination.itemsPerPage),
          sortBy: "id",
          direction: "ASC",
          active: String(activeStatus),
        });

        const response = await fetch(
          `${BASE_URL}/api/admin/products/?${params.toString()}`,
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
        return {
          data: result?.content.map((rp) => ({
            id: rp.id,
            name: rp.name,
            category: rp.category.name,
            supplier: rp.supplier.name,
            status: rp.active,
          })),
          totalPages: result?.totalPages || 1,
        };
      } catch (error) {
        console.error("Error fetching data:", error);
        return { data: [], totalPages: 1 };
      }
    };

    const fetchAllProducts = async () => {
      try {
        const [activeRes, inactiveRes] = await Promise.all([
          fetchProducts(true, pagination.activePage),
          fetchProducts(false, pagination.inactivePage),
        ]);

        setActiveProducts(activeRes.data);
        setInactiveProducts(inactiveRes.data);
        setPagination((prev) => ({
          ...prev,
          activeTotalPages: activeRes.totalPages,
          inactiveTotalPages: inactiveRes.totalPages,
        }));
      } catch (error) {
        console.error("Error fetching all products:", error);
      }
    };

    fetchAllProducts();
  }, [rfkey, pagination.activePage, pagination.inactivePage]);

  const handleActive = async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/products/activate/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setRfKey(!rfkey);
      }
    } catch (error) {
      alert("Đã có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handlePageChange = (page, type) => {
    setPagination((prev) => ({
      ...prev,
      [`${type}Page`]: page,
    }));
  };

  const filteredProducts = (products) =>
    products.filter(
      (product) =>
        product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const currentProducts =
    activeTab === "active"
      ? filteredProducts(activeProducts)
      : filteredProducts(inactiveProducts);

  const currentTotalPages =
    activeTab === "active"
      ? pagination.activeTotalPages
      : pagination.inactiveTotalPages;

  const currentPage =
    activeTab === "active" ? pagination.activePage : pagination.inactivePage;

  return (
    <div className="p-4">
      <h2 className="mb-4">Products List</h2>

      <div className="d-flex justify-content-between mb-4">
        <InputGroup style={{ width: "300px" }}>
          <InputGroup.Text>
            <FiSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="active" title="Active Products">
          <Table striped hover responsive className="mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts(activeProducts).map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.supplier}</td>
                  <td onClick={() => handleActive(product.id)}>
                    <Badge bg="success">active</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            {Array.from({ length: pagination.activeTotalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === pagination.activePage}
                onClick={() => handlePageChange(i + 1, "active")}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Tab>
        <Tab eventKey="inactive" title="Inactive Products">
          <Table striped hover responsive className="mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts(inactiveProducts).map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.supplier}</td>
                  <td onClick={() => handleActive(product.id)}>
                    <Badge bg="secondary">inactive</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            {Array.from({ length: pagination.inactiveTotalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === pagination.inactivePage}
                onClick={() => handlePageChange(i + 1, "inactive")}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminProd;
