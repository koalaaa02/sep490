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
  Modal,
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
  const [showDetail, setShowDetail] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
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
            registrationCertificateImages: rp.registrationCertificateImages,
            address: rp.address.address,
            tin: rp.tin,
            status: rp.active,
            products: rp.products?.map((product) => ({
              id: product.id,
              name: product.name,
              description: product.description,
              unit: product.unit,
              specifications: product.specifications,
            })),
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
        (typeof s?.name === "string" &&
          s?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof s?.manager?.name === "string" &&
          s?.manager?.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const handleShowDetail = (shop) => {
    setSelectedShop(shop);
    setShowDetail(true);
  };

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
                  <td
                    onClick={() => handleShowDetail(s)}
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    {typeof s.name === "string"
                      ? s.name
                      : "Tên cửa hàng không hợp lệ"}
                  </td>
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
                  <td
                    onClick={() => handleShowDetail(s)}
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    {typeof s.name === "string"
                      ? s.name
                      : "Tên cửa hàng không hợp lệ"}
                  </td>
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
      <Modal
        show={showDetail}
        onHide={() => setShowDetail(false)}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết cửa hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedShop && (
            <div>
              <p>
                <strong>Tên:</strong> {selectedShop.name}
              </p>
              <p>
                <strong>Chủ cửa hàng:</strong> {selectedShop.manager}
              </p>
              <p>
                <strong>Mã số:</strong> {selectedShop.tin}
              </p>
              <p>
                <strong>Đăng ký:</strong>{" "}
                {selectedShop.registrationCertificateImages}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {selectedShop.address}
              </p>
              <h5>Sản phẩm của cửa hàng:</h5>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên sản phẩm</th>
                    <th>Mô tả</th>
                    <th>Đơn vị</th>
                    <th>Thông số</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedShop.products?.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>{product.unit}</td>
                      <td>{product.specifications}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetail(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminProvider;
