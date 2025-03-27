import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { BASE_URL } from "../../../Utils/config";

type AddCategoryModalProps = {
  show: boolean;
  onHide: () => void;
  categories: Array<{ id?: number; name: string }>;
  onSuccess: () => void;
};

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  show,
  onHide,
  categories,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [hasParent, setHasParent] = useState(false);
  const [parentCategoryId, setParentCategoryId] = useState<number>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/admin/categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          parent: hasParent,
          parentCategoryId: hasParent ? parentCategoryId : undefined,
        }),
      });

      if (response.ok) {
        onSuccess();
        onHide();
        setName("");
        setHasParent(false);
        setParentCategoryId(undefined);
      } else {
        alert("Error occurred: " + response.statusText);
      }
    } catch (error) {
      alert("An error occurred, please try again");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Category</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="parent-switch"
              label="Does this category have a parent?"
              checked={hasParent}
              onChange={(e) => setHasParent(e.target.checked)}
            />
          </Form.Group>

          {hasParent && (
            <Form.Group className="mb-3">
              <Form.Label>Parent Category</Form.Label>
              <Form.Select
                value={parentCategoryId || ""}
                onChange={(e) => setParentCategoryId(Number(e.target.value))}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={!name || (hasParent && !parentCategoryId)}
          >
            Save
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AddCategoryModal;
