import React, { useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
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
  const [error, setError] = useState("");

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
        `${BASE_URL}/api/provider/shop/${shopId}`,
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
        throw new Error("Cập nhật cửa hàng thất bại.");
      }

      handleClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const businessTypes = [
    { value: "ENTERPRISE", label: "Doanh nghiệp" },
    { value: "BUSINESS", label: "Kinh doanh" },
  ];

  return (
    <>
      <Button variant="info" onClick={handleShow} style={{ width: "45px" }}>
        <FaEdit size={25} color="white" />
      </Button>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa thông tin cửa hàng</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3" controlId="shopName">
              <Form.Label>Tên cửa hàng</Form.Label>
              <Form.Control
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập tên cửa hàng.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="shopType">
              <Form.Label>Loại hình kinh doanh</Form.Label>
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
              <Form.Label>Địa chỉ</Form.Label>
              {address.length === 0 ? (
                <Alert variant="warning">
                  Không có địa chỉ nào được tìm thấy.
                </Alert>
              ) : (
                <Form.Select
                  name="addressId"
                  value={formData.addressId}
                  onChange={handleChange}
                  required
                >
                  {address.map((a) => {
                    const optionText = `${a?.recipientName || ""} - ${
                      a?.address || ""
                    }`;
                    return (
                      <option key={a.id} value={a.id} title={optionText}>
                        {optionText}
                      </option>
                    );
                  })}
                </Form.Select>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10,15}"
                required
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập số điện thoại hợp lệ (10-15 chữ số).
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Hủy bỏ
            </Button>
            <Button variant="primary" type="submit">
              Lưu thay đổi
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default EditShopModal;
