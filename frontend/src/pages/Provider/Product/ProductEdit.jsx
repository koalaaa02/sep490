import React, { useEffect, useState } from "react";
import { FaEdit, FaSearch } from "react-icons/fa";
import { BASE_URL } from "../../../Utils/config";
import { Link } from "react-router-dom";
import { Row, Col, Form, Card, Container } from "react-bootstrap";
import EditShopModal from "../../../Component/EditShopModal.tsx";

const EditShopProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const token = sessionStorage.getItem("access_token");
  const [data, setData] = useState(null);
  const [address, setAddress] = useState(null);
  const [products, setProducts] = useState(null);
  const [page, setPage] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [rf, setRF] = useState(true);
  const fileInputRef = React.useRef(null);
  const fileInputRef2 = React.useRef(null);
  const [editableUser, setEditableUser] = useState({
    citizenIdentificationCard: "",
  });

  const fetchProducts = async (search) => {
    if (!data?.id) return;
    
    try {
      const params = new URLSearchParams({
        page: page,
        size: pageSize,
        sortBy: "id",
        direction: "ASC",
        active: isActive,
        shopId: data?.id,
      });

      if (search) params.append("name", search);

      const responsePro = await fetch(
        `${BASE_URL}/api/provider/products/?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const resultPro = await responsePro.json();
      setProducts(resultPro);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (data?.id) {
      const delayDebounceFn = setTimeout(() => {
        fetchProducts(searchTerm);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm, data?.id, isActive, page, pageSize, rf]);

  useEffect(() => {
    fetchShopData();
  }, [page, rf]);

  const fetchShopData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/provider/shops/myshop`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();
      setData(result);

      if (result?.id) fetchProducts("");
    } catch (error) {
      console.error("Error fetching shop data:", error);
    }
  };

  const handleUploadFile = async (file, uploadType) => {
    const formData = new FormData();
    formData.append("file", file);

    let endpoint;
    let stateField;

    switch (uploadType) {
      case "registrationCertificate":
        endpoint = "uploadRegistrationCertificate";
        stateField = "citizenIdentificationCardImageDown";
        break;
      case "shopLogo":
        endpoint = "uploadLogoShop";
        stateField = "shopLogo";
        break;
      case "CitizenIdentityCardUp":
        endpoint = "uploadCitizenIdentityCardUp";
        stateField = "CitizenIdentityCardUp";
        break;
      case "CitizenIdentityCardDown":
        endpoint = "uploadCitizenIdentityCardDown";
        stateField = "CitizenIdentityCardDown";
        break;
      default:
        throw new Error(`Unknown upload type: ${uploadType}`);
    }

    const url = `${BASE_URL}/api/provider/shops/${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setRF(!rf);
        setEditableUser((prev) => ({
          ...prev,
          [stateField]: data.url,
        }));
      } else {
        
        alert(data?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Could not upload image.");
    }
  };

  const handleFileChange = (e, uploadType) => {
    const file = e.target.files[0];
    if (file) handleUploadFile(file, uploadType);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/addresses/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const result = await response.json();
        setAddress(result?.content);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container className="py-4" style={{ height: "80vh" }}>
      <Card className="h-100 shadow">
        <Card.Body className="d-flex flex-column h-100 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Thông tin cửa hàng</h4>
            {address && (
              <EditShopModal
                currentShopData={data}
                address={address}
                shopId={data?.id}
              />
            )}
          </div>

          <Row className="g-4 flex-grow-1">
            {/* Left Column - Shop Info */}
            <Col md={6}>
              <div className="d-flex flex-column h-100">
                <div className="d-flex align-items-center mb-4">
                  <div className="position-relative me-3">
                    <img
                      src={data?.logoImage}
                      alt="Shop Logo"
                      className="rounded-circle"
                      width="80"
                      height="80"
                    />
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded-circle hover-overlay">
                      <input
                        type="file"
                        ref={fileInputRef2}
                        onChange={(e) => handleFileChange(e, "shopLogo")}
                        style={{ display: "none" }}
                        accept="image/*"
                      />
                      <FaEdit
                        onClick={() => fileInputRef2.current.click()}
                        className="text-white fs-4 d-none"
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>
                  <div>
                    <h5 className="mb-1">{data?.name}</h5>
                    <small className="text-muted"> ID: {data?.id}</small>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="text-muted mb-3">THÔNG TIN CỬA HÀNG</h6>
                  <div className="ps-3">
                    <div className="mb-2">
                      <strong>Loại hình kinh doanh: </strong>
                      <span>
                        {data?.shopType === "ENTERPRISE"
                          ? "Large Enterprise"
                          : "Small Business"}
                      </span>
                    </div>
                    <div className="mb-2">
                      <strong>Địa chỉ: </strong>
                      <span>{data?.address?.address}</span>
                    </div>
                    <div className="mb-2">
                      <strong>số điện thoại: </strong>
                      <span>{data?.address?.phone}</span>
                    </div>
                    <div className="mb-2">
                      <strong>Tổng sản phẩm </strong>
                      <span>{products?.totalElements || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            {/* Right Column - Business License */}
            <Col md={6}>
              <div className="d-flex flex-column h-100 justify-content-center">
                <div className="text-center mb-3">
                  <h6 className="text-muted">GIẤY PHÉP KINH DOANH</h6>
                </div>
                <div className="position-relative mx-auto" style={{ maxWidth: "100%" }}>
                  <img
                    src={data?.registrationCertificateImages}
                    alt="Business License"
                    className="img-fluid border rounded"
                    style={{ maxHeight: "300px", width: "auto" }}
                    onError={(e) => {
                      e.target.src = 'placeholder.jpg';
                    }}
                  />
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center hover-overlay">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleFileChange(e, "registrationCertificate")}
                      style={{ display: "none" }}
                      accept="image/*"
                    />
                    <div
                      className="p-2 bg-primary rounded-circle"
                      onClick={() => fileInputRef.current.click()}
                      style={{ cursor: "pointer" }}
                    >
                      <FaEdit size={18} color="white" />
                    </div>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <small className="text-muted">
                Bấm icon xanh để tải lên giấy phép kinh doanh
                  </small>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditShopProduct;