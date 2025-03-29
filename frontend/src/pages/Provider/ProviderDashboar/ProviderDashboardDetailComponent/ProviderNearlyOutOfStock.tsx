import React, { useEffect, useState } from "react";
import { Alert, Badge, Modal, Table, Button, Image } from "react-bootstrap";
import { BASE_URL } from "../../../../Utils/config";

interface Product {
  id: number;
  name: string;
  description: string;
  specifications: string;
  images: string;
  unit: string;
  active: boolean;
  delete: boolean;
}

interface InventoryItem {
  id: number;
  skuCode: string;
  stock: number;
  costPrice: number;
  listPrice: number;
  sellingPrice: number;
  wholesalePrice: number;
  images: string;
  bulky: boolean;
  product: Product;
  delete: boolean;
}

const ProviderNearlyOutOfStock = () => {
  const token = localStorage.getItem("access_token");
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/provider/statistics/product/NearlyOutOfStock?limit=5`,
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

  const inventoryCount = inventoryData.length;

  return (
    <>
      <Alert
        variant="warning"
        className="d-flex align-items-center justify-content-between cursor-pointer"
        onClick={() => setShowModal(true)}
        style={{ cursor: "pointer" }}
      >
        <span className="fw-bold">Nearly Out Of Stock</span>
        <Badge pill bg="warning">
          {inventoryCount}
        </Badge>
      </Alert>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nearly Out Of Stock Products</Modal.Title>
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
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Stock</th>
                  <th>Price</th>
                  {/* <th>Status</th> */}
                </tr>
              </thead>
              <tbody>
                {inventoryData?.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Image
                          src={item.images || item.product.images}
                          thumbnail
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                          className="me-2"
                          onError={(
                            e: React.SyntheticEvent<HTMLImageElement, Event>
                          ) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/50";
                          }}
                        />
                        <div>
                          <div className="fw-bold">{item.product.name}</div>
                          <small className="text-muted">{item.skuCode}</small>
                        </div>
                      </div>
                    </td>
                    <td>{item.skuCode}</td>
                    <td>{item.stock}</td>
                    <td>${item.sellingPrice.toFixed(2)}</td>
                    {/* <td>
                      {item.stock > 0 ? (
                        <Badge bg="warning">Low Stock</Badge>
                      ) : (
                        <Badge bg="danger">Out of Stock</Badge>
                      )}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProviderNearlyOutOfStock;
