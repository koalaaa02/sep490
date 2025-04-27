import React, { useState } from "react";
import { BiTask } from "react-icons/bi";
import { RiShoppingCart2Line } from "react-icons/ri";
import { FaClipboardList, FaChartBar } from "react-icons/fa";
import { HiChatBubbleBottomCenterText } from "react-icons/hi2";
import { MdAddBox, MdOutlineBusAlert, MdOutlineNoteAlt } from "react-icons/md";

const SidebarComponent = ({ setSelectedComponent, selectedComponent }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleClick = (component) => {
    setSelectedComponent(component);
  };

  const getItemStyle = (component) => {
    return selectedComponent === component
      ? {
          backgroundColor: "#ffc107",
          color: "black",
          borderRadius: "5px",
          paddingRight: "20px",
          width: "220px",
        }
      : {};
  };

  return (
    <div className="d-flex flex-column p-3 bg-light" style={{ width: "250px" }}>
      <ul className="nav flex-column navbar-nav navbar-light">
        <li>
          <button
            className="nav-link"
            style={getItemStyle("ProviderDashBoardDetail")}
            onClick={() => handleClick("ProviderDashBoardDetail")}
          >
            <FaChartBar size={30} className="ms-1" /> Thống kê
          </button>
        </li>
        <li>
          <button
            className="nav-link"
            style={getItemStyle("ProductList")}
            onClick={() => handleClick("ProductList")}
          >
            <RiShoppingCart2Line size={30} className="ms-1" />
            Danh sách sản phẩm
          </button>
        </li>
        <li>
          <button
            className="nav-link"
            style={getItemStyle("AddProduct")}
            onClick={() => handleClick("AddProduct")}
          >
            <MdAddBox size={30} className="ms-1" />
            Thêm sản phẩm
          </button>
        </li>
        <li>
          <button
            className="nav-link"
            style={getItemStyle("InvoiceManagement")}
            onClick={() => handleClick("InvoiceManagement")}
          >
            <BiTask size={30} className="ms-1" />
            Danh sách khoản nợ
          </button>
        </li>
        <li>
          <button
            className="nav-link"
            style={getItemStyle("OrderList")}
            onClick={() => handleClick("OrderList")}
          >
            <FaClipboardList size={30} className="ms-1" />
            Danh sách đặt hàng
          </button>
        </li>
        <li>
          <button
            className="nav-link"
            style={getItemStyle("SupplierLisr")}
            onClick={() => handleClick("SupplierLisr")}
          >
            <MdOutlineBusAlert size={30} className="ms-1" />
            Danh sách nhà đối tác
          </button>
        </li>
        <li>
          <button
            className="nav-link"
            style={getItemStyle("DeliveryList")}
            onClick={() => handleClick("DeliveryList")}
          >
            <MdOutlineNoteAlt size={30} className="ms-1" /> Phiếu giao hàng
          </button>
        </li>
        <li>
          <button
            className="nav-link"
            style={getItemStyle("transaction")}
            onClick={() => handleClick("transaction")}
          >
            <MdOutlineNoteAlt size={30} className="ms-1" /> Chi Phí
          </button>
        </li>
        <li>
          <button
            className="nav-link"
            style={getItemStyle("ChatBox")}
            onClick={() => {
              setSelectedComponent("ChatBox");
              toggleDropdown("chat");
            }}
          >
            <HiChatBubbleBottomCenterText size={30} className="ms-1" /> Trò
            chuyện
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SidebarComponent;
