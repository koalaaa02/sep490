import React, { useEffect, useState } from "react";
import { Button, Form, Card, Row, Col, Alert } from "react-bootstrap"; // Added Alert
import { BASE_URL } from "../../../Utils/config";

const AdminBankAccount = () => {
  const [account, setAccount] = useState({
    id: 1, // Assuming this ID is fixed for this component's purpose
    bankName: "", // This will likely store the bank code from vietqr.io
    accountNumber: "",
    accountHolderName: "",
    defaultBankAccount: false,
    createdAt: "",
    updatedAt: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [originalAccount, setOriginalAccount] = useState(null); // Initialize as null
  const [isLoading, setIsLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const token = sessionStorage.getItem("access_token");
  const [banks, setBanks] = useState([]);
  const params = new URLSearchParams({
    page: 1,
    size: 100,
    sortBy: "id",
    direction: "ASC",
  });
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const [accountResponse, banksResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/bankaccounts/?${params.toString()}`, {
            // Hardcoded ID 1
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            // credentials: "include", // Usually not needed with Bearer token
          }),
          fetch("https://api.vietqr.io/v2/banks"),
        ]);

        if (!accountResponse.ok) {
          // Handle specific case like 404 Not Found if it's meaningful (e.g., account doesn't exist yet)
          if (accountResponse.status === 404) {
            setApiError(
              "Không tìm thấy thông tin tài khoản ngân hàng. Có thể cần tạo mới."
            );
            // Potentially set a default empty account structure for creation if applicable
            setAccount((prev) => ({
              ...prev,
              bankName: "",
              accountNumber: "",
              accountHolderName: "",
            })); // Reset if not found
            setOriginalAccount({
              ...account,
              id: 1,
              bankName: "",
              accountNumber: "",
              accountHolderName: "",
            }); // Default structure
          } else {
            throw new Error(
              `Lỗi tải thông tin tài khoản: ${accountResponse.status} ${accountResponse.statusText}`
            );
          }
        } else {
          const accountData = await accountResponse.json();
          console.log(accountData?.content[0]);

          setAccount(accountData?.content[0]);
          setOriginalAccount(accountData?.content[0]);
        }

        if (!banksResponse.ok) {
          throw new Error(
            `Lỗi tải danh sách ngân hàng: ${banksResponse.status} ${banksResponse.statusText}`
          );
        }
        const banksData = await banksResponse.json();
        if (banksData && Array.isArray(banksData.data)) {
          setBanks(banksData.data);
        } else {
          console.warn("API VietQR không trả về dữ liệu ngân hàng mong đợi.");
          setBanks([]);
          setApiError((prev) =>
            prev
              ? `${prev}\nKhông tải được danh sách ngân hàng.`
              : "Không tải được danh sách ngân hàng."
          );
        }
      } catch (error) {
        console.error("Lỗi khi fetch API:", error);
        setApiError(error.message || "Đã xảy ra lỗi khi tải dữ liệu.");
        // If account fetch failed, originalAccount might be null or outdated.
        // Ensure account state is reasonable for UI display even on error.
        if (!originalAccount) {
          setOriginalAccount({ ...account }); // Fallback to current account state
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      // Only fetch if token is available
      fetchData();
    } else {
      setApiError("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Rerun if token changes, though typically token is stable per session.

  const validateForm = () => {
    const errors = {};
    const { bankName, accountNumber, accountHolderName } = account;

    if (!bankName || bankName.trim() === "") {
      errors.bankName = "Vui lòng chọn tên ngân hàng.";
    }
    if (!accountNumber || accountNumber.trim() === "") {
      errors.accountNumber = "Số tài khoản không được để trống.";
    } else if (!/^\d+$/.test(accountNumber.trim())) {
      errors.accountNumber = "Số tài khoản chỉ được chứa chữ số.";
    }
    // Add more specific account number validation if needed (e.g., length based on bank)
    if (!accountHolderName || accountHolderName.trim() === "") {
      errors.accountHolderName = "Tên chủ tài khoản không được để trống.";
    } else if (/[!@#$%^&*(),.?":{}|<>0-9]/.test(accountHolderName.trim())) {
      errors.accountHolderName =
        "Tên chủ tài khoản không được chứa ký tự đặc biệt hoặc số.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEdit = () => {
    setEditMode(true);
    setFormErrors({}); // Clear any previous errors when entering edit mode
    setApiError(null);
  };

  const handleCancel = () => {
    if (originalAccount) {
      setAccount(originalAccount);
    }
    setEditMode(false);
    setFormErrors({});
    setApiError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAccount((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (formErrors[name]) {
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
    if (apiError) setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Ensure account.id is part of the payload if your backend expects it for PUT
      const payload = {
        id: account.id || 1, // Use account.id if available, fallback to 1
        bankName: account.bankName, // This is the bank code, e.g., "VCB"
        accountNumber: account.accountNumber.trim(),
        accountHolderName: account.accountHolderName.trim().toUpperCase(), // Often stored in uppercase
        defaultBankAccount: account.defaultBankAccount,
      };

      const response = await fetch(
        `${BASE_URL}/api/bankaccounts/${payload.id}`,
        {
          // Use payload.id
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        let errorMsg = `Lỗi: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) errorMsg = errorData.message;
          if (
            errorData &&
            errorData.errors &&
            typeof errorData.errors === "object"
          ) {
            // Assuming errorData.errors is { fieldName: "error message" }
            setFormErrors((prev) => ({ ...prev, ...errorData.errors }));
          }
        } catch (jsonError) {
          // console.error("Failed to parse error JSON:", jsonError);
        }
        throw new Error(errorMsg);
      }

      const updatedData = await response.json();
      setAccount(updatedData);
      setOriginalAccount(updatedData);
      setEditMode(false);
      setFormErrors({});
      setApiError(null);
      alert("Thay đổi thông tin thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật tài khoản:", error);
      setApiError(
        error.message || "Không thể cập nhật tài khoản. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !originalAccount) {
    // Show loading only if initial data isn't there yet
    return (
      <div className="p-4 text-center">Đang tải thông tin tài khoản...</div>
    );
  }

  return (
    <div className="p-4" style={{ height: "90vh" }}>
      <Card>
        <Card.Header>
          <h4>Thông tin tài khoản ngân hàng</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit} noValidate>
            {apiError && (
              <Alert
                variant="danger"
                onClose={() => setApiError(null)}
                dismissible
              >
                {apiError}
              </Alert>
            )}
            <Row className="mb-3">
              <Form.Group as={Col} md={6} controlId="bankName">
                <Form.Label>Tên ngân hàng</Form.Label>
                <Form.Select
                  name="bankName"
                  value={account.bankName}
                  onChange={handleChange}
                  disabled={!editMode || isLoading}
                  isInvalid={!!formErrors.bankName}
                >
                  <option value="">-- Chọn ngân hàng --</option>
                  {banks.map((bank) => (
                    <option key={bank.id || bank.code} value={bank.code}>
                      {bank.shortName} ({bank.name})
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formErrors.bankName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} controlId="accountNumber">
                <Form.Label>Số tài khoản</Form.Label>
                <Form.Control
                  type="text"
                  name="accountNumber"
                  placeholder="Nhập số tài khoản"
                  value={account.accountNumber}
                  onChange={handleChange}
                  disabled={!editMode || isLoading}
                  isInvalid={!!formErrors.accountNumber}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.accountNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md={6} controlId="accountHolderName">
                <Form.Label>Tên chủ tài khoản</Form.Label>
                <Form.Control
                  type="text"
                  name="accountHolderName"
                  placeholder="Tên chủ tài khoản (không dấu)"
                  value={account.accountHolderName}
                  onChange={handleChange}
                  disabled={!editMode || isLoading}
                  isInvalid={!!formErrors.accountHolderName}
                  style={{ textTransform: "uppercase" }}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.accountHolderName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} controlId="defaultBankAccount">
                <Form.Label>Tài khoản mặc định</Form.Label>
                <div className="mt-2">
                  <Form.Check
                    type="switch"
                    id="defaultBankAccountSwitch"
                    name="defaultBankAccount"
                    label={
                      account.defaultBankAccount
                        ? "Đang là mặc định"
                        : "Đặt làm mặc định"
                    }
                    checked={account.defaultBankAccount}
                    onChange={handleChange}
                    disabled={!editMode || isLoading}
                  />
                </div>
              </Form.Group>
            </Row>

            {!editMode &&
              (originalAccount?.createdAt || originalAccount?.updatedAt) && ( // Only show if not in edit mode and data exists
                <Row className="mb-3">
                  {originalAccount.createdAt && (
                    <Form.Group as={Col} md={6} controlId="createdAt">
                      <Form.Label>Ngày tạo</Form.Label>
                      <Form.Control
                        type="text"
                        value={new Date(
                          originalAccount.createdAt
                        ).toLocaleString()}
                        readOnly
                        plaintext
                      />
                    </Form.Group>
                  )}
                  {originalAccount.updatedAt && (
                    <Form.Group as={Col} md={6} controlId="updatedAt">
                      <Form.Label>Ngày cập nhật</Form.Label>
                      <Form.Control
                        type="text"
                        value={new Date(
                          originalAccount.updatedAt
                        ).toLocaleString()}
                        readOnly
                        plaintext
                      />
                    </Form.Group>
                  )}
                </Row>
              )}

            <div className="d-flex justify-content-end mt-4">
              {!editMode ? (
                <Button
                  variant="primary"
                  onClick={handleEdit}
                  disabled={isLoading || !originalAccount}
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline-secondary"
                    onClick={handleCancel}
                    className="me-2"
                    disabled={isLoading}
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
