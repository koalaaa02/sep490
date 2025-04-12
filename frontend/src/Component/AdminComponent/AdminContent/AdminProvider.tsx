import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import ShopTable from "../AdminProviderComponent/ShopTable.tsx";
import ShopSearch from "../AdminProviderComponent/ShopSearch.tsx";
import ShopDetail from "../AdminProviderComponent/ShopDetail.tsx";
import ShopPagination from "../AdminProviderComponent/ShopPagination.tsx";
import { BASE_URL } from "../../../Utils/config";
import { Shop, PaginationState } from "../AdminProviderComponent/type.ts";

const ShopList = () => {
  const token = localStorage.getItem("access_token");
  const [activeShop, setActiveShop] = useState<Shop[]>([]);
  const [inactiveShop, setInactiveShop] = useState<Shop[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [rfkey, setRfKey] = useState(true);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    activePage: 1,
    inactivePage: 1,
    itemsPerPage: 10,
  });

  useEffect(() => {
    const fetchData = async (activeStatus: boolean, page: number) => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          size: pagination.itemsPerPage.toString(),
          sortBy: "id",
          direction: "ASC",
          active: activeStatus.toString(),
        });

        const response = await fetch(
          `${BASE_URL}/api/admin/shops/?${params.toString()}`,
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
          fetchData(true, pagination.activePage),
          fetchData(false, pagination.inactivePage),
        ]);

        setActiveShop(activeRes.data);
        setInactiveShop(inactiveRes.data);
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
      "Bạn có chắc chắn muốn thay đổi trạng thái cửa hàng này không?"
    );

    if (!confirmAction) return;
    try {
      const response = await fetch(`${BASE_URL}/api/admin/shops/${id}/active`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

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

  const filtered = (shops: Shop[]) =>
    shops.filter(
      (shop) =>
        shop?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop?.manager?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleShowDetail = (shop: Shop) => {
    setSelectedShop(shop);
  };

  const handleBackToList = () => {
    setSelectedShop(null);
  };

  if (selectedShop) {
    return (
      <ShopDetail
        shop={selectedShop}
        onBack={handleBackToList}
        onStatusToggle={handleActive}
      />
    );
  }

  return (
    <div className="p-4">
      <h2 className="mb-4">Danh sách cửa hàng</h2>

      <ShopSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k as string)}
        className="mb-3"
      >
        <Tab eventKey="active" title="Đang hoạt động">
          <ShopTable
            shops={filtered(activeShop)}
            onRowClick={handleShowDetail}
            onStatusToggle={handleActive}
            statusType="active"
          />
          <ShopPagination
            currentPage={pagination.activePage}
            totalPages={pagination.activeTotalPages || 1}
            onPageChange={(page) => handlePageChange(page, "active")}
          />
        </Tab>
        <Tab eventKey="inactive" title="Không hoạt động">
          <ShopTable
            shops={filtered(inactiveShop)}
            onRowClick={handleShowDetail}
            onStatusToggle={handleActive}
            statusType="inactive"
          />
          <ShopPagination
            currentPage={pagination.inactivePage}
            totalPages={pagination.inactiveTotalPages || 1}
            onPageChange={(page) => handlePageChange(page, "inactive")}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ShopList;
