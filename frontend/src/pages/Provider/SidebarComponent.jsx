import React, { useState } from "react";
import { BiTask } from "react-icons/bi";
import { RiShoppingCart2Line } from "react-icons/ri";
import { FaClipboardList, FaChartBar } from "react-icons/fa";
import { HiChatBubbleBottomCenterText } from "react-icons/hi2";
import { MdAddBox, MdOutlineNoteAlt } from "react-icons/md";

const SidebarComponent = ({ setSelectedComponent }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="d-flex flex-column p-3 bg-light" style={{ width: "250px" }}>
      <ul className="nav flex-column navbar-nav navbar-light">
        <li>
          <button
            className="nav-link"
            onClick={() => setSelectedComponent("ProviderDashBoardDetail")}
          >
            <FaChartBar size={30} className="ms-1" /> Thống kê
          </button>
        </li>
        <li>
          <button
            className="nav-link"
            onClick={() => setSelectedComponent("ProductList")}
          >
            <RiShoppingCart2Line size={30} className="ms-1" />
            Danh sách sản phẩm
          </button>
        </li>
        <li>
          <button
            className="nav-link"
            onClick={() => setSelectedComponent("AddProduct")}
          >
            <MdAddBox size={30} className="ms-1" />
            Thêm sản phẩm
          </button>
        </li>
        <li>
          <button
            className="nav-link"
            onClick={() => setSelectedComponent("InvoiceManagement")}
          >
            <BiTask size={30} className="ms-1" />
            Danh sách khoản nợ
          </button>
        </li>
        <li>
          <button
            className="nav-link"
            onClick={() => setSelectedComponent("OrderList")}
          >
            <FaClipboardList size={30} className="ms-1" />
            Danh sách đặt hàng
          </button>
        </li>
        <li>
          <button
            className="nav-link"
            onClick={() => setSelectedComponent("DeliveryList")}
          >
            <MdOutlineNoteAlt size={30} className="ms-1" /> Phiếu giao hàng
          </button>
        </li>
        <li>
          <button
            className="nav-link"
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
