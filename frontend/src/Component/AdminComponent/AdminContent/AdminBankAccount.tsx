import React, { useEffect, useState } from "react";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { BASE_URL } from "../../../Utils/config";

const AdminBankAccount = () => {
  const [account, setAccount] = useState({
    id: 1,
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    defaultBankAccount: false,
    createdAt: "",
    updatedAt: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [originalAccount, setOriginalAccount] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("access_token");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/bankaccounts/1`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error(`Lỗi: ${response.status}`);

        const data = await response.json();
        console.log(data);

        setAccount(data);
        setOriginalAccount(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi khi fetch API:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setAccount(originalAccount);
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAccount((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/bankaccounts/1`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          bankName: account.bankName,
          accountNumber: account.accountNumber,
          accountHolderName: account.accountHolderName,
          defaultBankAccount: account.defaultBankAccount,
        }),
      });

      if (!response.ok) throw new Error(`Lỗi: ${response.status}`);

      const updatedData = await response.json();
      setAccount(updatedData);
      setEditMode(false);
      setOriginalAccount(updatedData);
    } catch (error) {
      console.error("Lỗi khi cập nhật tài khoản:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <Card.Header>
          <h4>Thông tin tài khoản ngân hàng</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md={6} controlId="bankName">
                <Form.Label>Tên ngân hàng</Form.Label>
                <Form.Control
                  type="text"
                  name="bankName"
                  value={account.bankName}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </Form.Group>

              <Form.Group as={Col} md={6} controlId="accountNumber">
                <Form.Label>Số tài khoản</Form.Label>
                <Form.Control
                  type="text"
                  name="accountNumber"
                  value={account.accountNumber}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md={6} controlId="accountHolderName">
                <Form.Label>Tên chủ tài khoản</Form.Label>
                <Form.Control
                  type="text"
                  name="accountHolderName"
                  value={account.accountHolderName}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </Form.Group>

              <Form.Group as={Col} md={6} controlId="defaultBankAccount">
                <Form.Label>Tài khoản mặc định</Form.Label>
                <div className="mt-2">
                  <Form.Check
                    type="switch"
                    id="defaultBankAccountSwitch"
                    name="defaultBankAccount"
                    label={account.defaultBankAccount ? "Có" : "Không"}
                    checked={account.defaultBankAccount}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md={6} controlId="createdAt">
                <Form.Label>Ngày tạo</Form.Label>
                <Form.Control
                  type="text"
                  value={new Date(account.createdAt).toLocaleString()}
                  readOnly
                  plaintext
                />
              </Form.Group>

              <Form.Group as={Col} md={6} controlId="updatedAt">
                <Form.Label>Ngày cập nhật</Form.Label>
                <Form.Control
                  type="text"
                  value={new Date(account.updatedAt).toLocaleString()}
                  readOnly
                  plaintext
                />
              </Form.Group>
            </Row>

            <div className="d-flex justify-content-end mt-4">
              {!editMode ? (
                <Button variant="primary" onClick={handleEdit}>
                  Chỉnh sửa
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    className="me-2"
                  >
                    Hủy bỏ
                  </Button>
                  <Button variant="success" type="submit" disabled={isLoading}>
                    {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                </>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminBankAccount;
