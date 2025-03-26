import React, { useEffect, useState } from "react";
import { Table, Button, Form, InputGroup, Badge } from "react-bootstrap";
import { BASE_URL } from "../../../Utils/config";
import { FiSearch } from "react-icons/fi";

const AdminCate = () => {
  const token = localStorage.getItem("access_token");
  const [categories, setCatogories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: 1,
          size: 10,
          sortBy: "id",
          direction: "ASC",
        });
        console.log(`${BASE_URL}/api/admin/products/?${params.toString()}`);
        // console.log(params.());

        const response = await fetch(
          `${BASE_URL}/api/admin/products/?${params.toString()}`,
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
        setCatogories(
          result.content.map((c) => ({
            name: c.name,
            id: c.id,
            image: c.images,
          }))
        );
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchData();
  }, []);
  const FilteredCategories = categories.filter((product) =>
    product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(categories);

  return (
    <div className="p-4">
      <h2 className="mb-4">Categories List</h2>

      {/* Search and Add Product */}
      <div className="d-flex justify-content-between mb-4">
        <InputGroup style={{ width: "300px" }}>
          <InputGroup.Text>
            <FiSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Button variant="primary">Add Categories</Button>
      </div>

      {/* Products Table */}
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>

            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {FilteredCategories.map((c) => (
            <tr key={c.id}>
              <td width={20}>{c.id}</td>
              <td width={200}>
                <img
                  height={150}
                  width={150}
                  className="object-fit-cover"
                  src={c.image}
                  alt={`${c.name} images`}
                />
              </td>

              <td>{c.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminCate;
