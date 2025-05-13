import React, { useState, useRef } from "react";
import { Image, Button } from "react-bootstrap";
import { BASE_URL } from "../../../Utils/config";
import { useSelector } from "react-redux";

const UploadCertificate = ({
  label,
  accept,
  handleFileChange,
  apiEndpoint,
}) => {
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const token = useSelector((state) => state.auth.token);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.(jpeg|jpg|png)")) {
      alert("Vui lòng chọn file ảnh (JPEG, JPG hoặc PNG)");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // If an API endpoint is provided, upload the file
    if (apiEndpoint) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`${BASE_URL}${apiEndpoint}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
          // You might need to add headers like Authorization here
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        // Pass the response data to parent component if needed
        handleFileChange(data);
      } catch (error) {
        console.error("Upload error:", error);
        alert("Upload thất bại. Vui lòng thử lại.");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    } else {
      // Just pass the file event to parent component
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
      <label className="form-label">{label}</label>
      <input
        ref={fileInputRef}
        type="file"
        className="form-control"
        accept={accept}
        onChange={handleChange}
        disabled={isUploading}
      />
      <small className="text-muted">
        Chỉ chấp nhận file ảnh (JPG, JPEG, PNG)
      </small>

      {isUploading && (
        <div className="progress mt-2">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${uploadProgress}%` }}
            aria-valuenow={uploadProgress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {uploadProgress}%
          </div>
        </div>
      )}

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
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleRemove}
              disabled={isUploading}
            >
              Xóa ảnh
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCertificate;
