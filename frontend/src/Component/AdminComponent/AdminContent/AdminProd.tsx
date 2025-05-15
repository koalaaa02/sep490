import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import ProductTable from "../AdminProdComponent/ProductTable.tsx";
import ProductSearch from "../AdminProdComponent/ProductSearch.tsx";
import { BASE_URL } from "../../../Utils/config";
import ProductDetail from "../AdminProdComponent/ProductDetail.tsx";
import ProductPagination from "../AdminProdComponent/ProductPagination.tsx";

interface Product {
  id: number;
  name: string;
  category: string;
  supplier: string;
  status: boolean;
}

interface PaginationState {
  activePage: number;
  inactivePage: number;
  itemsPerPage: number;
  activeTotalPages?: number;
  inactiveTotalPages?: number;
}

const ProductList = () => {
  const token = sessionStorage.getItem("access_token");
  const [activeProducts, setActiveProducts] = useState<Product[]>([]);
  const [inactiveProducts, setInactiveProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [rfkey, setRfKey] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    activePage: 1,
    inactivePage: 1,
    itemsPerPage: 10,
  });

  useEffect(() => {
    const fetchProducts = async (activeStatus: boolean, page: number) => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          size: String(pagination.itemsPerPage),
          sortBy: "id",
          direction: "ASC",
          active: String(activeStatus),
        });

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
        return {
          data: result?.content || [],
          totalPages: result?.totalPages || 1,
        };
      } catch (error) {
        console.error("Error fetching data:", error);
        return { data: [], totalPages: 1 };
      }
    };

    const fetchAllProducts = async () => {
      try {
        const [activeRes, inactiveRes] = await Promise.all([
          fetchProducts(true, pagination.activePage),
          fetchProducts(false, pagination.inactivePage),
        ]);

        setActiveProducts(activeRes.data);
        setInactiveProducts(inactiveRes.data);
        setPagination((prev) => ({
          ...prev,
          activeTotalPages: activeRes.totalPages,
          inactiveTotalPages: inactiveRes.totalPages,
        }));
      } catch (error) {
        console.error("Error fetching all products:", error);
      }
    };

    fetchAllProducts();
  }, [rfkey, pagination.activePage, pagination.inactivePage, token]);

  const handleActive = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmAction = window.confirm(
      "Bạn có chắc chắn muốn thay đổi trạng thái sản phẩm này không?"
    );
    if (!confirmAction) return;
    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/products/activate/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setRfKey(!rfkey);
      }
    } catch (error) {
      alert("Đã có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handlePageChange = (page: number, type: string) => {
    setPagination((prev) => ({
      ...prev,
      [`${type}Page`]: page,
    }));
  };

  const filteredProducts = (products: Product[]) =>
    products.filter(
      (product) =>
        product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleRowClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
  };
  console.log(activeProducts);

  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={handleBackToList}
        onStatusToggle={handleActive}
      />
    );
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-center">Danh sách sản phẩm</h2>

      <ProductSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k as string)}
        className="mb-3"
      >
        <Tab eventKey="active" title="Sản phẩm kích hoạt">
          <ProductTable
            products={filteredProducts(activeProducts)}
            onRowClick={handleRowClick}
            onStatusToggle={handleActive}
            statusType="active"
          />
          <ProductPagination
            currentPage={pagination.activePage}
            totalPages={pagination.activeTotalPages || 1}
            onPageChange={(page) => handlePageChange(page, "active")}
          />
        </Tab>
        <Tab eventKey="inactive" title="Sản phẩm ngừng kích hoạt">
          <ProductTable
            products={filteredProducts(inactiveProducts)}
            onRowClick={handleRowClick}
            onStatusToggle={handleActive}
            statusType="inactive"
          />
          <ProductPagination
            currentPage={pagination.inactivePage}
            totalPages={pagination.inactiveTotalPages || 1}
            onPageChange={(page) => handlePageChange(page, "inactive")}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ProductList;
