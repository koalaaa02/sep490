import React, { useState, useRef } from "react";
import { Image, Button } from "react-bootstrap";

const UploadCertificate = ({ handleFileChange }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.(jpeg|jpg|png)")) {
        alert("Vui lòng chọn file ảnh (JPEG, JPG hoặc PNG)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      handleFileChange(e);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    handleFileChange({ target: { files: [] } }); // Clear file in parent
  };

  return (
    <div className="mb-3">
      <label className="form-label">Giấy phép đăng ký kinh doanh:</label>
      <input
        ref={fileInputRef}
        type="file"
        className="form-control"
        accept=".jpg,.jpeg,.png"
        onChange={handleChange}
      />
      <small className="text-muted">
        Chỉ chấp nhận file ảnh (JPG, JPEG, PNG)
      </small>

      {preview && (
        <div className="mt-3">
          <div className="d-flex align-items-center">
            <Image
              src={preview}
              alt="Preview"
              thumbnail
              style={{ maxWidth: "200px", maxHeight: "200px" }}
              className="me-3"
            />
            <Button variant="outline-danger" size="sm" onClick={handleRemove}>
              Xóa ảnh
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCertificate;
