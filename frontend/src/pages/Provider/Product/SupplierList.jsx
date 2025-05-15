import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { BASE_URL } from "../../../Utils/config";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const token = sessionStorage.getItem("access_token");

  // Form state for new supplier
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contactEmail: "",
    phone: "",
    address: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    contactEmail: "",
    phone: "",
    address: "",
  });

  // Validate form function
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!newSupplier.name.trim()) {
      errors.name = "Vui lòng nhập tên nhà đối tác";
      isValid = false;
    }

    if (!newSupplier.contactEmail.trim()) {
      errors.contactEmail = "Vui lòng nhập email";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newSupplier.contactEmail)) {
      errors.contactEmail = "Email không hợp lệ";
      isValid = false;
    }

    if (!newSupplier.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại";
      isValid = false;
    } else if (!/^\d{10,11}$/.test(newSupplier.phone)) {
      errors.phone = "Số điện thoại phải có 10-11 chữ số";
      isValid = false;
    }

    if (!newSupplier.address.trim()) {
      errors.address = "Vui lòng nhập địa chỉ";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/api/provider/suppliers/?page=1&size=10&sortBy=id&direction=ASC`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tải danh sách nhà đối tác");
      }

      const data = await response.json();
      setSuppliers(data.content || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Handle create new supplier
  const handleCreateSupplier = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(`${BASE_URL}/api/provider/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSupplier),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        setError(errorDetails);
        return;
      }

      // Success handling
      setShowModal(false);
      setNewSupplier({
        name: "",
        contactEmail: "",
        phone: "",
        address: "",
      });
      setFormErrors({
        name: "",
        contactEmail: "",
        phone: "",
        address: "",
      });
      fetchSuppliers(); // Refresh the list
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  // Handle row click to show detail
  const handleRowClick = (supplier) => {
    setSelectedSupplier(supplier);
    setShowDetail(true);
  };

  // Handle close detail modal
  const handleCloseDetail = () => {
    setShowDetail(false);
    fetchSuppliers(); // Refresh the list after possible edits
  };

  // Reset form when modal closes
  const handleModalClose = () => {
    setShowModal(false);
    setNewSupplier({
      name: "",
      contactEmail: "",
      phone: "",
      address: "",
    });
    setFormErrors({
      name: "",
      contactEmail: "",
      phone: "",
      address: "",
    });
    setError(null);
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="mt-4 min-vh-100">
      <Row className="justify-content-between mb-3">
        <Col>
          <h2>Danh sách nhà đối tác</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FaPlus className="me-2" /> Thêm nhà đối tác
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {suppliers.length === 0 ? (
        <div className="text-center py-5">
          <h4>Không có nhà đối tác nào</h4>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            className="mt-3"
          >
            <FaPlus className="me-2" /> Thêm nhà đối tác mới
          </Button>
        </div>
      ) : (
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên nhà đối tác</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Ngày thêm</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr
                key={supplier.id}
                onClick={() => handleRowClick(supplier)}
                style={{ cursor: "pointer" }}
              >
                <td>{index + 1}</td>
                <td>{supplier.name}</td>
                <td>{supplier.contactEmail}</td>
                <td>{supplier.phone}</td>
                <td>{supplier.address}</td>
                <td>{new Date(supplier.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add Supplier Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm nhà đối tác</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên nhà đối tác *</Form.Label>
              <Form.Control
                type="text"
                value={newSupplier.name}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, name: e.target.value })
                }
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                value={newSupplier.contactEmail}
                onChange={(e) =>
                  setNewSupplier({
                    ...newSupplier,
                    contactEmail: e.target.value,
                  })
                }
                isInvalid={!!formErrors.contactEmail}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.contactEmail}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại *</Form.Label>
              <Form.Control
                type="tel"
                value={newSupplier.phone}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, phone: e.target.value })
                }
                isInvalid={!!formErrors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newSupplier.address}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, address: e.target.value })
                }
                isInvalid={!!formErrors.address}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.address}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleCreateSupplier}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <SupplierDetail
          show={showDetail}
          handleClose={handleCloseDetail}
          supplier={selectedSupplier}
          token={token}
        />
      )}
    </Container>
  );
};

const SupplierDetail = ({ show, handleClose, supplier, token }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedSupplier, setEditedSupplier] = useState(supplier);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    name: "",
    contactEmail: "",
    phone: "",
    address: "",
  });

  // Validate form function
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!editedSupplier.name.trim()) {
      errors.name = "Vui lòng nhập tên nhà đối tác";
      isValid = false;
    }

    if (!editedSupplier.contactEmail.trim()) {
      errors.contactEmail = "Vui lòng nhập email";
      isValid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedSupplier.contactEmail)
    ) {
      errors.contactEmail = "Email không hợp lệ";
      isValid = false;
    }

    if (!editedSupplier.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại";
      isValid = false;
    } else if (!/^\d{10,11}$/.test(editedSupplier.phone)) {
      errors.phone = "Số điện thoại phải có 10-11 chữ số";
      isValid = false;
    }

    if (!editedSupplier.address.trim()) {
      errors.address = "Vui lòng nhập địa chỉ";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSupplier((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/provider/suppliers/${supplier.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedSupplier),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể cập nhật nhà đối tác");
      }

      setEditMode(false);
      handleClose();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhà đối tác này?")) {
      try {
        const response = await fetch(
          `${BASE_URL}/api/provider/suppliers/${supplier.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể xóa nhà đối tác");
        }

        handleClose(); // This will trigger a refresh in the parent component
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Thông tin nhà đối tác</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        {editMode ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên nhà đối tác *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editedSupplier.name}
                onChange={handleInputChange}
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="contactEmail"
                value={editedSupplier.contactEmail}
                onChange={handleInputChange}
                isInvalid={!!formErrors.contactEmail}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.contactEmail}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại *</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={editedSupplier.phone}
                onChange={handleInputChange}
                isInvalid={!!formErrors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ *</Form.Label>
              <Form.Control
                as="textarea"
                name="address"
                rows={3}
                value={editedSupplier.address}
                onChange={handleInputChange}
                isInvalid={!!formErrors.address}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.address}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        ) : (
          <div>
            <p>
              <strong>STT:</strong> {supplier.id}
            </p>
            <p>
              <strong>Tên:</strong> {supplier.name}
            </p>
            <p>
              <strong>Email:</strong> {supplier.contactEmail}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {supplier.phone}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {supplier.address}
            </p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>
          <FaTrash className="me-2" /> Xóa
        </Button>
        {editMode ? (
          <>
            <Button variant="secondary" onClick={() => setEditMode(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Lưu
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setEditMode(true)}>
            <FaEdit className="me-2" /> Sửa
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default SupplierList;
