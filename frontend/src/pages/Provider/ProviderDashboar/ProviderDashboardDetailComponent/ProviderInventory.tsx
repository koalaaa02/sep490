import React, { useEffect, useState } from "react";
import { Alert, Badge, Modal, Table, Button } from "react-bootstrap";
import { BASE_URL } from "../../../../Utils/config";

const ProviderInventory = () => {
  const token = localStorage.getItem("access_token");
  const [inventoryData, setInventoryData] = useState<Record<string, number>>(
    {}
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/provider/statistics/product/inventory`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const result = await response.json();
        setInventoryData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const inventoryCount = Object.keys(inventoryData).length;

  return (
    <>
      <Alert
        variant="info"
        className="d-flex align-items-center justify-content-between cursor-pointer"
        onClick={() => setShowModal(true)}
        style={{ cursor: "pointer" }}
      >
        <span className="fw-bold">Hàng tồn kho</span>
        <Badge pill bg="primary">
          {inventoryCount}
        </Badge>
      </Alert>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết hàng tồn kho</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            maxHeight: "70vh",
            overflowY: "auto",
            paddingTop: 0,
          }}
        >
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(inventoryData)?.map(
                  ([productName, quantity], index) => (
                    <tr key={productName}>
                      <td>{index + 1}</td>
                      <td>{productName}</td>
                      <td>{quantity.toLocaleString()}</td>
                      <td>
                        {quantity > 0 ? (
                          <Badge bg="success">Còn</Badge>
                        ) : (
                          <Badge bg="danger">Đã hết</Badge>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProviderInventory;
