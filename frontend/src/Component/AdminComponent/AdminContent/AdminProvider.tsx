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

const AdminProvider = () => {
  const token = localStorage.getItem("access_token");
  const [activeShop, setActiveShop] = useState([]);
  const [inactiveShop, setInactiveShop] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [rfkey, setRfKey] = useState(true);
  const [pagination, setPagination] = useState({
    activePage: 1,
    inactivePage: 1,
    itemsPerPage: 10,
  });

  useEffect(() => {
    const fetchData = async (activeStatus, page) => {
      try {
        const params = new URLSearchParams({
          page: page,
          size: pagination.itemsPerPage,
          sortBy: "id",
          direction: "ASC",
          active: activeStatus,
        });

        const response = await fetch(
          `${BASE_URL}/api/admin/shops/?${params.toString()}`,
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
            manager: rp.manager.name,
            tin: rp.tin,
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
          fetchData(true, pagination.activePage),
          fetchData(false, pagination.inactivePage),
        ]);

        setActiveShop(activeRes.data);
        setInactiveShop(inactiveRes.data);
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
    const confirmAction = window.confirm(
      "Bạn có chắc chắn muốn thay đổi trạng thái cửa hàng này không?"
    );
    if (!confirmAction) return;
    try {
      const response = await fetch(`${BASE_URL}/api/admin/shops/${id}/active`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

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
  const filtered = (s) =>
    s.filter(
      (s) =>
        s?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s?.manager?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const current =
    activeTab === "active" ? filtered(activeShop) : filtered(inactiveShop);

  const currentTotalPages =
    activeTab === "active"
      ? pagination.activeTotalPages
      : pagination.inactiveTotalPages;

  const currentPage =
    activeTab === "active" ? pagination.activePage : pagination.inactivePage;

  return (
    <div className="p-4">
      <h2 className="mb-4">Danh sách cửa hàng</h2>

      <div className="d-flex justify-content-between mb-4">
        <InputGroup style={{ width: "300px" }}>
          <InputGroup.Text>
            <FiSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Tìm kiếm cửa hàng..."
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
        <Tab eventKey="active" title="Đang hoạt động">
          <Table striped hover responsive className="mt-3">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên cửa hàng</th>
                <th>Chủ cửa hàng</th>
                <th>Mã số</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filtered(activeShop).map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.manager}</td>
                  <td>{s.tin}</td>
                  <td onClick={() => handleActive(s.id)}>
                    <Badge bg="success">Hoạt động</Badge>
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
        <Tab eventKey="inactive" title="Không hoạt động">
          <Table striped hover responsive className="mt-3">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên cửa hàng</th>
                <th>Chủ cửa hàng</th>
                <th>Mã số</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filtered(inactiveShop).map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.manager}</td>
                  <td>{s.tin}</td>
                  <td onClick={() => handleActive(s.id)}>
                    <Badge bg="secondary">Dừng hoạt động</Badge>
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

export default AdminProvider;
