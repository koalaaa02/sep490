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
  const token = localStorage.getItem("access_token");

  // Form state for new supplier
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contactEmail: "",
    phone: "",
    address: "",
  });

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    try {
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
      const data = await response.json();
      setSuppliers(data.content);
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
    try {
      const response = await fetch(`${BASE_URL}/api/provider/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSupplier),
      });

      if (!response.ok) throw new Error("Failed to create supplier");

      setShowModal(false);
      setNewSupplier({
        name: "",
        contactEmail: "",
        phone: "",
        address: "",
      });
      fetchSuppliers(); // Refresh the list
    } catch (err) {
      setError(err);
      alert(err.message);
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

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );

  return (
    <Container className="mt-4 min-vh-100">
      <Row className="justify-content-between mb-3">
        <Col>
          <h2>Supplier List</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FaPlus className="me-2" /> Add Supplier
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {suppliers?.map((supplier) => (
            <tr
              key={supplier.id}
              onClick={() => handleRowClick(supplier)}
              style={{ cursor: "pointer" }}
            >
              <td>{supplier.id}</td>
              <td>{supplier.name}</td>
              <td>{supplier.contactEmail}</td>
              <td>{supplier.phone}</td>
              <td>{supplier.address}</td>
              <td>{new Date(supplier.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Supplier Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* {error.name && <Alert variant="danger">{error.name}</Alert>} */}
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newSupplier.name}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, name: e.target.value })
                }
              />
            </Form.Group>
            {error?.contactEmailr && (
              <Alert variant="danger">{error?.contactEmail}</Alert>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newSupplier.contactEmail}
                onChange={(e) =>
                  setNewSupplier({
                    ...newSupplier,
                    contactEmail: e.target.value,
                  })
                }
              />
            </Form.Group>
            {error?.phone && <Alert variant="danger">{error?.phone}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                value={newSupplier.phone}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, phone: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newSupplier.address}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, address: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateSupplier}>
            Save Supplier
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <SupplierDetail
          show={showDetail}
          handleClose={handleCloseDetail}
          supplier={selectedSupplier}
        />
      )}
    </Container>
  );
};

const SupplierDetail = ({ show, handleClose, supplier }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedSupplier, setEditedSupplier] = useState(supplier);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/provider/suppliers/${supplier.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedSupplier),
        }
      );

      if (!response.ok) throw new Error("Failed to update supplier");

      setEditMode(false);
      handleClose(); // This will trigger a refresh in the parent component
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
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

        if (!response.ok) throw new Error("Failed to delete supplier");

        handleClose(); // This will trigger a refresh in the parent component
      } catch (err) {
        setError(err);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Supplier Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        {editMode ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editedSupplier.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              {error?.contactEmail && (
                <Alert variant="danger">{error?.contactEmail}</Alert>
              )}

              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="contactEmail"
                value={editedSupplier.contactEmail}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              {error?.phone && <Alert variant="danger">{error?.phone}</Alert>}
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={editedSupplier.phone}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                name="address"
                rows={3}
                value={editedSupplier.address}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        ) : (
          <div>
            <p>
              <strong>ID:</strong> {supplier.id}
            </p>
            <p>
              <strong>Name:</strong> {supplier.name}
            </p>
            <p>
              <strong>Email:</strong> {supplier.contactEmail}
            </p>
            <p>
              <strong>Phone:</strong> {supplier.phone}
            </p>
            <p>
              <strong>Address:</strong> {supplier.address}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(supplier.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(supplier.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>
          <FaTrash className="me-2" /> Delete
        </Button>
        {editMode ? (
          <>
            <Button variant="secondary" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setEditMode(true)}>
            <FaEdit className="me-2" /> Edit
          </Button>
        )}
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SupplierList;
