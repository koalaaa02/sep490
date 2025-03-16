import React, { useState } from "react";
import SidebarComponent from "./SidebarComponent";
import InvoiceManagement from "./Invoice/InvoiceManagement";
import AddInvoice from "./Invoice/AddInvoice";
import ProductList from "./Product/ProductList";

const ProviderDashBoard = () => {
  const [selectedComponent, setSelectedComponent] = useState("InvoiceList");

  const renderComponent = () => {
    switch (selectedComponent) {
      case "InvoiceManagement":
        return <InvoiceManagement />;
      case "AddInvoice":
        return <AddInvoice />;
        case "ProductList":
          return <ProductList />;
      default:
        return <InvoiceManagement />;
    }
  };

  return (
    <div className="d-flex">
      <SidebarComponent setSelectedComponent={setSelectedComponent} />
      <div className="flex-grow-1 p-1">{renderComponent()}</div>
    </div>
  );
};

export default ProviderDashBoard;
