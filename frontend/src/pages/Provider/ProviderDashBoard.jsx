import React, { useState } from "react";
import SidebarComponent from "./SidebarComponent";
import InvoiceManagement from "./Invoice/InvoiceManagement";
import AddInvoice from "./Invoice/AddInvoice";
import ProductList from "./Product/ProductList";
import ProductDetail from "./Product/ProductDetail";
import AddProduct from "./Product/AddProduct";
import ProviderDashBoardDetail from "./ProviderDashboar/ProviderDashBoardDetail.tsx";
import OrderList from "./Product/OrderList";
import ChatBox from "./Chat/ChatBox";
import DeliveryList from "./Product/DeliveryList.jsx";
import AddPayment from "./Invoice/AddPayment";
import SupplierList from "./Product/SupplierList.jsx";
import Transaction from "./Product/Transaction.tsx";
import EditShopProduct from "./Product/ProductEdit.jsx";

const ProviderDashBoard = () => {
  const [selectedComponent, setSelectedComponent] = useState(
    "EditShop"
  );
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleSidebarClick = (component) => {
    setSelectedComponent(component);
    setSelectedProductId(null);
  };

  const renderComponent = () => {
    if (selectedProductId) {
      return (
        <ProductDetail
          productId={selectedProductId}
          setSelectedProductId={setSelectedProductId}
        />
      );
    }

    switch (selectedComponent) {
      case "EditShop":
        return <EditShopProduct />;
      case "ProviderDashBoardDetail":
        return <ProviderDashBoardDetail />;
      case "InvoiceManagement":
        return <InvoiceManagement />;
      case "AddInvoice":
        return <AddInvoice />;
      case "AddPayment":
        return <AddPayment />;
      case "ProductList":
        return <ProductList setSelectedProductId={setSelectedProductId} />;
      case "AddProduct":
        return (
          <AddProduct
            onAddProduct={(newProduct) => {
              setSelectedComponent("ProductList");
            }}
            onCancel={() => setSelectedComponent("ProductList")}
          />
        );

      case "OrderList":
        return <OrderList />;
      case "SupplierLisr":
        return <SupplierList />;
      case "ChatBox":
        return <ChatBox />;
      case "DeliveryList":
        return <DeliveryList />;
      case "transaction":
        return <Transaction />;
      default:
        return <InvoiceManagement />;
    }
  };

  return (
    <div className="d-flex">
      <SidebarComponent
        setSelectedComponent={handleSidebarClick}
        selectedComponent={selectedComponent}
      />
      <div className="flex-grow-1 p-1">{renderComponent()}</div>
    </div>
  );
};

export default ProviderDashBoard;
