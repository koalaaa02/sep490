import React, { useEffect, useState } from "react";
import { FaSearch, FaEye, FaTrash, FaStore } from "react-icons/fa";
import { BASE_URL } from "../../../Utils/config";

const ProductList = ({ setSelectedProductId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("access_token");
  const [data, setData] = useState(null);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    fetchShopData();
  }, []);

  useEffect(() => {
    if (data?.id) {
      const delayDebounceFn = setTimeout(() => {
        fetchProducts(searchTerm);
      }, 500); 

      return () => clearTimeout(delayDebounceFn); 
    }
  }, [searchTerm, data?.id]); 

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

      if (result?.id) {
        fetchProducts(""); 
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
  };

  const fetchProducts = async (search) => {
    try {
      const params = new URLSearchParams({
        page: 1,
        size: 100,
        sortBy: "id",
        direction: "ASC",
        active: true,
        shopId: data?.id,
      });

      if (search) {
        params.append("name", search);
      }

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
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/api/provider/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        alert("Xóa sản phẩm thành công!");
        fetchProducts(searchTerm);

      } else {
        alert("Xóa sản phẩm thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  return (
    <div className="p-3 mb-10">
      <div className="p-3 shadow bg-light rounded">
        <div className="d-flex align-items-center">
          <img
            // src={data.registrationCertificateImages}
            alt="Shop Logo"
            className="rounded-circle me-3"
            width="80"
            height="80"
          />
          <p>Tên cửa hàng: {data?.name}</p>
        </div>
        <div className="d-flex align-items-center">
          <p>Shop type: {data?.shopType}</p>
        </div>
        <div className="d-flex align-items-center">
          <p>Địa chỉ: {data?.address?.address}</p>
        </div>
        <div className="d-flex align-items-center">
          <p>Số điện thoại: {data?.address?.phone}</p>
        </div>
        <hr />

        <div className="d-flex flex-wrap justify-content-between">
          <p>
            <FaStore /> Sản Phẩm: <strong>{data?.products?.length}</strong>
          </p>
        </div>
      </div>
      <h5 className="mb-3 mt-3">Danh sách sản phẩm</h5>
      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Tìm kiếm sản phẩm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-dark">
          <FaSearch />
        </button>
      </div>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Mô tả</th>
            <th>Thông số kỹ thuật</th>
            <th>Đơn vị</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products?.content?.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td title={product.description}>
                {product.description.length > 50
                  ? product.description.substring(0, 50) + "..."
                  : product.description}
              </td>
              <td>{product.specifications}</td>
              <td>{product.unit}</td>
              <td>
                <FaEye
                  className="mx-1 text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedProductId(product.id)}
                />
                <FaTrash
                  className="mx-1 text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteProduct(product.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
