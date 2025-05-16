import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { BASE_URL } from "../Utils/config";

const EditShopModal = ({ shopId, currentShopData, address }) => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    shopName: currentShopData?.name || "",
    shopType: currentShopData?.shopType || "ENTERPRISE",
    addressId: currentShopData?.addressId || 0,
    phone: currentShopData?.address?.phone || "",
  });
  const token = localStorage.getItem("access_token");

  const [validated, setValidated] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/dealer/shop/update/${shopId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: shopId,
            name: formData.shopName,
            shopType: formData.shopType,
            addressId: Number(formData.addressId),
            phone: formData.phone,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update shop");
      }

      handleClose();
    } catch (error) {
      console.error("Error updating shop:", error);
    }
  };

  const businessTypes = [
    { value: "ENTERPRISE", label: "Enterprise" },
    { value: "BUSINESS", label: "Business" },
  ];

  console.log(address);

  return (
    <>
      <Button variant="info" onClick={handleShow} style={{ width: "45px" }}>
        <FaEdit size={25} color="white" />
      </Button>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Shop Information</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="shopName">
              <Form.Label>Shop Name</Form.Label>
              <Form.Control
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a shop name.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="shopType">
              <Form.Label>Business Type</Form.Label>
              <Form.Select
                name="shopType"
                value={formData.shopType}
                onChange={handleChange}
                required
              >
                {businessTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="addressId">
              <Form.Label>Address</Form.Label>
              <Form.Select
                name="addressId"
                value={formData.addressId}
                onChange={handleChange}
                required
                style={{
                  maxWidth: "100%",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {address.map((a) => {
                  const optionText = `${a?.recipientName || ""} - ${
                    a?.address || ""
                  }`;
                  return (
                    <option
                      key={a.id}
                      value={a.id}
                      title={optionText} // Show full text on hover
                      style={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        maxWidth: "100%",
                      }}
                    >
                      {optionText}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10,15}" // Adjust pattern as needed
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid phone number (10-15 digits).
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default EditShopModal;
