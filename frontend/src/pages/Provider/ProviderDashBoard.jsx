import React, { useState } from "react";
import SidebarComponent from "./SidebarComponent";
import InvoiceManagement from "./Invoice/InvoiceManagement";
import AddInvoice from "./Invoice/AddInvoice";
import ProductList from "./Product/ProductList";
import ProductDetail from "./Product/ProductDetail";
import AddProduct from "./Product/AddProduct";

const ProviderDashBoard = () => {
  const [selectedComponent, setSelectedComponent] = useState("InvoiceList");
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
      case "InvoiceManagement":
        return <InvoiceManagement />;
      case "AddInvoice":
        return <AddInvoice />;
      case "ProductList":
        return <ProductList setSelectedProductId={setSelectedProductId} />;
      case "AddProduct":
        return <AddProduct />;
      default:
        return <InvoiceManagement />;
    }
  };

  return (
    <div className="d-flex">
      <SidebarComponent setSelectedComponent={handleSidebarClick} />
      <div className="flex-grow-1 p-1">{renderComponent()}</div>
    </div>
  );
};

export default ProviderDashBoard;
