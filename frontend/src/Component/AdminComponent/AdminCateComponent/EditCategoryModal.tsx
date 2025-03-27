import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, Button, Row, Col, Image } from "react-bootstrap";
import { BASE_URL } from "../../../Utils/config";

type EditCategoryModalProps = {
  show: boolean;
  onHide: () => void;
  category: {
    id?: number;
    name: string;
    parentName?: string;
    image?: string;
  };
  categories: Array<{ id?: number; name: string }>;
  onSuccess: () => void;
};

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  show,
  onHide,
  category,
  categories,
  onSuccess,
}) => {
  const [name, setName] = useState(category.name);
  const [hasParent, setHasParent] = useState(!!category.parentName);
  const [parentCategoryId, setParentCategoryId] = useState<number>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(category.name);
    setHasParent(!!category.parentName);
    setPreviewImage(category.image || null);
    setSelectedFile(null);
  }, [category]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // First update category details
      const response = await fetch(
        `${BASE_URL}/api/admin/categories/${category.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: category.id,
            name,
            parent: hasParent,
            parentCategoryId: hasParent ? parentCategoryId : undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update category details");
      }

      if (selectedFile) {
        await handleUpload();
      }

      onSuccess();
      onHide();
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !category.id) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/categories/${category.id}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          credentials: "include",
          body: formData,
        }
      );
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Category</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col xs={6}>
              <div className="mb-3">
                <strong>Current Name:</strong> {category.name}
              </div>
              <div className="mb-3">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt={category.name}
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                    thumbnail
                  />
                ) : (
                  <div className="text-muted">No image available</div>
                )}
              </div>
              <Form.Group className="mb-3">
                <Form.Label>Change Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
                {selectedFile && (
                  <div className="mt-2">
                    <small>Selected: {selectedFile.name}</small>
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="mb-3">
                <Form.Label>New Category Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              {category.parentName ? (
                <Form.Group className="mb-3">
                  <Form.Label>Parent Category</Form.Label>
                  <Form.Select
                    value={parentCategoryId || ""}
                    onChange={(e) =>
                      setParentCategoryId(Number(e.target.value))
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              ) : (
                <>
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
                        onChange={(e) =>
                          setParentCategoryId(Number(e.target.value))
                        }
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  )}
                </>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default EditCategoryModal;
