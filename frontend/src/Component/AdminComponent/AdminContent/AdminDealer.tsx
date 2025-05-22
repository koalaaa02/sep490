import React, { useState } from "react";
import {
  Card,
  Table,
  Button,
  Form,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

const usersData = [
  {
    id: "1",
    name: "Hồ Thị Thanh Ngân",
    address: "159-157 Tân Quới Thước, Quận 1, HCM",
    email: "123@gmail.com",
    cccd: "123",
    phone: "0923478126",
    position: "Người bán hàng",
    active: true,
  },
  {
    id: "2",
    name: "Trần Khắc Ái",
    address: "6 Nguyễn Lương Bằng, Tân Bình, HCM",
    email: "123@gmail.com",
    cccd: "123",
    phone: "0987231482",
    position: "Người mua hàng",
    active: false,
  },
  {
    id: "3",
    name: "Nguyễn Văn B",
    address: "123 Lê Lợi, Quận 3, HCM",
    email: "abc@gmail.com",
    cccd: "321",
    phone: "0912345678",
    position: "Người bán hàng",
    active: true,
  },
];

const ITEMS_PER_PAGE = 5;

const AdminDealer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState(usersData);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleToggleActive = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, active: !user.active } : user
    );
    setUsers(updatedUsers);
  };

  const handleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const idsOnPage = paginatedUsers.map((user) => user.id);
      setSelectedUsers((prev) => [...new Set([...prev, ...idsOnPage])]);
    } else {
      const idsOnPage = paginatedUsers.map((user) => user.id);
      setSelectedUsers((prev) => prev.filter((id) => !idsOnPage.includes(id)));
    }
  };

  const handleDeleteSelected = () => {
    setUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.id)));
    setSelectedUsers([]);
  };

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => {
      if (statusFilter === "active") return user.active === true;
      if (statusFilter === "deactive") return user.active === false;
      return true;
    })
    .filter((user) => {
      if (positionFilter) return user.position === positionFilter;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return Number(a.id) - Number(b.id);
      else return Number(b.id) - Number(a.id);
    });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const allSelectedOnPage = paginatedUsers.every((user) =>
    selectedUsers.includes(user.id)
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Card className="p-1 m-4 shadow-sm">
      <Card.Header>
        <h3> Danh sách người dùng</h3>
      </Card.Header>
      <Card.Body>
        {/* Bộ lọc */}
        <Row className="mb-3 g-2">
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm theo tên hoặc ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Col>
          <Col md={3}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="deactive">Ngừng hoạt động</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={positionFilter}
              onChange={(e) => {
                setPositionFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Tất cả chức vụ</option>
              {[...new Set(users.map((u) => u.position))].map((pos, i) => (
                <option key={i} value={pos}>
                  {pos}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="asc">ID tăng dần</option>
              <option value="desc">ID giảm dần</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Bảng dữ liệu */}
        <Table hover responsive>
          <thead className="table-light">
            <tr>
              <th
                className="text-center align-middle p-2"
                style={{ width: "50px" , height: "55px"}}
              >
                <Form.Check
                  type="checkbox"
                  checked={allSelectedOnPage}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>#</th>
              <th>Họ và tên</th>
              <th>Địa chỉ</th>
              <th>Email</th>
              <th>Số CCCD</th>
              <th>SĐT</th>
              <th>Vai trò</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <Form.Check
                    className="text-center align-middle"
                    style={{ width: "50px" }}
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </td>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.address}</td>
                <td>{user.email}</td>
                <td>{user.cccd}</td>
                <td>{user.phone}</td>
                <td>{user.position}</td>
                <td>
                  <Button
                    variant={user.active ? "success" : "secondary"}
                    size="sm"
                    className="me-2"
                    onClick={() => handleToggleActive(user.id)}
                  >
                    {user.active ? "Kích hoạt" : "Ngừng kích hoạt"}
                  </Button>
                </td>
              </tr>
            ))}
            {paginatedUsers.length === 0 && (
              <tr>
                <td className="text-center">Không tìm thấy nhân viên.</td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Phân trang */}
        {totalPages > 1 && (
          <Pagination className="justify-content-end">
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
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
        )}

        {selectedUsers.length > 0 && (
          <div className="d-flex justify-content-end gap-2 mb-2">
            <Button variant="danger" onClick={handleDeleteSelected}>
              Xóa
            </Button>
            <Button variant="secondary" onClick={() => setSelectedUsers([])}>
              Hủy
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default AdminDealer;
