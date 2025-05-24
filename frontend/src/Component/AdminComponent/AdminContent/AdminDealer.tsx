import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Form,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
import { BASE_URL } from "../../../Utils/config";

const AdminDealer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("true");
  const [positionFilter, setPositionFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const token = sessionStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: currentPage,
          size: itemsPerPage,
          sortBy: "id",
          direction: sortOrder === "asc" ? "ASC" : "DESC",
          active: statusFilter,
        });

        const response = await fetch(
          `${BASE_URL}/api/admin/users/?${params.toString()}`,
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
        setTotalElements(result.totalElements || 0);
        setUsers(result.content || []);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchData();
  }, [statusFilter, sortOrder, currentPage, itemsPerPage]);

  const handleToggleActive = async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/users/changeActive/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Thay đổi trạng thái thất bại.");
      }

      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      );
      setUsers(updatedUsers);
      alert("Cập nhật trạng thái tài khoản thành công!");
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái tài khoản!");
    }
  };

  const handleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (isChecked) => {
    const idsOnPage = users.map((user) => user.id);
    if (isChecked) {
      setSelectedUsers((prev) => [...new Set([...prev, ...idsOnPage])]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => !idsOnPage.includes(id)));
    }
  };

  const handleDeleteSelected = () => {
    setUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.id)));
    setSelectedUsers([]);
  };

  const filteredUsers = users
    .filter((user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => {
      if (positionFilter) {
        return user.roles?.some((role) => role.name === positionFilter);
      }
      return true;
    });

  const totalPages = Math.ceil(totalElements / itemsPerPage);
  const allSelectedOnPage = users.every((user) => selectedUsers.includes(user.id));

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div style={{ height: "85vh" }}>
      <Card className="p-1 m-4 shadow-sm">
        <Card.Header>
          <h3>Danh sách người dùng</h3>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3 g-2">
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm theo tên người dùng ..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </Col>
            <Col md={3}>
              <Form.Select
                value={positionFilter}
                onChange={(e) => {
                  setPositionFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tất cả vai trò</option>
                <option value="ROLE_DEALER">Người mua</option>
                <option value="ROLE_PROVIDER">Người bán</option>
                <option value="ROLE_ADMIN">Quản trị viên</option>
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
                <option value="asc">Cũ nhất</option>
                <option value="desc">Mới nhất</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5 mục/trang</option>
                <option value={10}>10 mục/trang</option>
                <option value={20}>20 mục/trang</option>
              </Form.Select>
            </Col>
          </Row>

          <Row className="mb-3 g-2">
            <h5>Trạng thái:</h5>
            <Col md={5}>
              <div className="d-flex gap-2">
                <Button
                  variant={statusFilter === "true" ? "success" : "outline-success"}
                  onClick={() => {
                    setStatusFilter("true");
                    setCurrentPage(1);
                  }}
                >
                  Đang hoạt động
                </Button>
                <Button
                  variant={statusFilter === "false" ? "secondary" : "outline-secondary"}
                  onClick={() => {
                    setStatusFilter("false");
                    setCurrentPage(1);
                  }}
                >
                  Ngừng hoạt động
                </Button>
              </div>
            </Col>
          </Row>

          <Table hover responsive>
            <thead className="table-light">
              <tr>
                <th className="text-center align-middle p-2" style={{ width: "50px", height: "55px" }}>
                  <Form.Check
                    type="checkbox"
                    checked={allSelectedOnPage}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th>#</th>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Số CCCD</th>
                <th>Vai trò</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
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
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.citizenIdentificationCard}</td>
                    <td>
                      {user.roles.map((role) => {
                        let label = "";
                        let badgeClass = "";

                        switch (role.name) {
                          case "ROLE_DEALER":
                            label = "Người mua";
                            badgeClass = "bg-primary";
                            break;
                          case "ROLE_PROVIDER":
                            label = "Người bán";
                            badgeClass = "bg-success";
                            break;
                          case "ROLE_ADMIN":
                            label = "Quản trị viên";
                            badgeClass = "bg-danger";
                            break;
                          default:
                            label = role.name;
                            badgeClass = "bg-secondary";
                        }

                        return (
                          <span key={role.id} className={`badge ${badgeClass} me-1`}>
                            {label}
                          </span>
                        );
                      })}
                    </td>
                    <td>
                      <Form.Check
                        type="switch"
                        id={`custom-switch-${user.id}`}
                        checked={user.active}
                        label={user.active ? "Đang hoạt động" : "Ngừng hoạt động"}
                        disabled={user.roles.some((role) => role.name === "ROLE_ADMIN")}
                        onChange={() => {
                          const confirmed = window.confirm(
                            `Bạn có chắc muốn ${user.active ? "ngừng" : "kích hoạt"} tài khoản này không?`
                          );
                          if (confirmed) {
                            handleToggleActive(user.id);
                          }
                        }}
                      />
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-3 text-muted">
                    Không tìm thấy kết quả.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="justify-content-end">
              <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          )}

          {/* Action Buttons */}
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
    </div>
  );
};

export default AdminDealer;
