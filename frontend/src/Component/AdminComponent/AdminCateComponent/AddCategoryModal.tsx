import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap"; // Added Alert
import { BASE_URL } from "../../../Utils/config";

type Category = {
  id: number; // Assuming selectable parent categories will always have an ID
  name: string;
  // Add other properties if they exist, e.g., parentId for filtering if needed
};

type AddCategoryModalProps = {
  show: boolean;
  onHide: () => void;
  categories: Category[]; // Use the more specific Category type
  onSuccess: () => void; // Callback after successful creation
};

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  show,
  onHide,
  categories,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [hasParent, setHasParent] = useState(false);
  const [parentCategoryId, setParentCategoryId] = useState<number | undefined>(
    undefined
  );
  const [errors, setErrors] = useState<{
    name?: string;
    parentCategoryId?: string;
    api?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to reset form when the modal is shown (if needed, or rely on onHide logic)
  // This can be useful if the modal instance is reused and 'show' prop changes.
  useEffect(() => {
    if (show) {
      // Optionally reset form fields if modal is re-shown,
      // or ensure handleCloseModal covers all reset needs.
      // For now, handleCloseModal will manage resets.
    }
  }, [show]);

  const handleCloseModal = () => {
    setName("");
    setHasParent(false);
    setParentCategoryId(undefined);
    setErrors({});
    setIsSubmitting(false);
    onHide(); // Call the original onHide prop from parent
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; parentCategoryId?: string } = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Tên danh mục không được để trống.";
      isValid = false;
    }
    // Potential: Check if category name already exists (client-side or rely on API)

    if (hasParent && !parentCategoryId) {
      newErrors.parentCategoryId = "Vui lòng chọn danh mục cha.";
      isValid = false;
    }

    setErrors(newErrors); // Set field-specific errors
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors((prev) => ({
      api: undefined,
      name: prev.name,
      parentCategoryId: prev.parentCategoryId,
    })); // Clear only API error before validation

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Logic for 'parent' field based on original code:
    // payload.parent = true if it's a top-level category (hasParent is false)
    // payload.parent = false if it's a child category (hasParent is true)
    const payload = {
      name: name.trim(),
      parent: !hasParent,
      parentCategoryId: hasParent ? parentCategoryId : undefined,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/admin/categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        // credentials: "include", // Usually not needed with Bearer token auth
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onSuccess(); // Refresh parent component's category list
        handleCloseModal(); // Reset form, clear errors, and hide modal
        // Optionally: show a success toast/message if needed
      } else {
        const errorData = await response
          .json()
          .catch(() => ({
            message: `Lỗi ${response.status}: ${response.statusText}`,
          }));
        // Check if backend provides field-specific errors
        if (errorData.errors && typeof errorData.errors === "object") {
          setErrors((prev) => ({
            ...prev,
            ...errorData.errors,
            api: errorData.message || "Vui lòng kiểm tra lại các trường.",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            api:
              errorData.message ||
              `Lỗi ${response.status}: ${response.statusText}`,
          }));
        }
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      setErrors((prev) => ({
        ...prev,
        api:
          error.message ||
          "Đã có lỗi kết nối hoặc lỗi không xác định, vui lòng thử lại.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle changes and clear respective errors
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name || errors.api) {
      setErrors((prev) => ({ ...prev, name: undefined, api: undefined }));
    }
  };

  const handleHasParentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setHasParent(isChecked);
    if (!isChecked) {
      // If it's no longer a child, clear parent category and its error
      setParentCategoryId(undefined);
      if (errors.parentCategoryId || errors.api) {
        setErrors((prev) => ({
          ...prev,
          parentCategoryId: undefined,
          api: undefined,
        }));
      }
    } else {
      // If it becomes a child, just clear general API error for now
      if (errors.api) {
        setErrors((prev) => ({ ...prev, api: undefined }));
      }
    }
  };

  const handleParentCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setParentCategoryId(value ? Number(value) : undefined);
    if (errors.parentCategoryId || errors.api) {
      setErrors((prev) => ({
        ...prev,
        parentCategoryId: undefined,
        api: undefined,
      }));
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Thêm phân loại mới</Modal.Title>
      </Modal.Header>
      {/* Using <Form> component from react-bootstrap for proper structure with onSubmit */}
      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Body>
          {errors.api && <Alert variant="danger">{errors.api}</Alert>}

          <Form.Group className="mb-3" controlId="categoryName">
            <Form.Label>Tên danh mục:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên danh mục..."
              value={name}
              onChange={handleNameChange}
              isInvalid={!!errors.name}
              disabled={isSubmitting}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="hasParentSwitch">
            <Form.Check
              type="switch"
              label="Là danh mục con (thuộc danh mục cha)?"
              checked={hasParent}
              onChange={handleHasParentChange}
              disabled={isSubmitting}
            />
          </Form.Group>

          {hasParent && (
            <Form.Group className="mb-3" controlId="parentCategoryId">
              <Form.Label>Chọn danh mục cha:</Form.Label>
              <Form.Select
                value={parentCategoryId || ""}
                onChange={handleParentCategoryChange}
                isInvalid={!!errors.parentCategoryId}
                disabled={isSubmitting || categories.length === 0}
              >
                <option value="">-- Chọn danh mục cha --</option>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Không có danh mục cha nào
                  </option>
                )}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.parentCategoryId}
              </Form.Control.Feedback>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            disabled={isSubmitting}
          >
            Đóng
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;
