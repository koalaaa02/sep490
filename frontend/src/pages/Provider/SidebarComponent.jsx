import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiTask } from "react-icons/bi";
import { RiShoppingCart2Line } from "react-icons/ri";
import { FaClipboardList } from "react-icons/fa";
import { HiChatBubbleBottomCenterText } from "react-icons/hi2";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { TbMessageReport } from "react-icons/tb";

const SidebarComponent = ({ setSelectedComponent }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div
      className="d-flex flex-column p-3 bg-light"
      style={{ width: "250px", height: "100vh" }}
    >
      <ul className="nav flex-column navbar-nav navbar-light">
        {/* Hóa đơn */}
        <li className="nav-item">
          <button
            className="nav-link"
            onClick={() => toggleDropdown("invoice")}
          >
            <BiTask size={30} className="ms-1" /> Hóa đơn
          </button>
          {openDropdown === "invoice" && (
            <div className="dropdown-menu show">
              <button
                className="dropdown-item"
                onClick={() => setSelectedComponent("InvoiceManagement")}
              >
                Danh sách hóa đơn
              </button>
              <button
                className="dropdown-item"
                onClick={() => setSelectedComponent("AddInvoice")}
              >
                Thêm hóa đơn
              </button>
            </div>
          )}
        </li>

        {/* Quản lý sản phẩm */}
        <li className="nav-item">
          <button
            className="nav-link"
            onClick={() => toggleDropdown("product")}
          >
            <RiShoppingCart2Line size={30} className="ms-1" /> Quản lý sản phẩm
          </button>
          {openDropdown === "product" && (
            <div className="dropdown-menu show">
              <button
                className="dropdown-item"
                onClick={() => setSelectedComponent("ProductList")}
              >
                Danh sách sản phẩm
              </button>
              <Link className="dropdown-item" to="#">
                Thêm sản phẩm
              </Link>
            </div>
          )}
        </li>

        {/* Đặt hàng */}
        <li className="nav-item">
          <button className="nav-link" onClick={() => toggleDropdown("order")}>
            <FaClipboardList size={30} className="ms-1" /> Đặt hàng
          </button>
          {openDropdown === "order" && (
            <div className="dropdown-menu show">
              <Link className="dropdown-item" to="#">
                Danh sách đặt hàng
              </Link>
            </div>
          )}
        </li>

        {/* Báo cáo */}
        <li className="nav-item">
          <button className="nav-link" onClick={() => toggleDropdown("report")}>
            <TbMessageReport size={30} className="ms-1" /> Báo cáo
          </button>
          {openDropdown === "report" && (
            <div className="dropdown-menu show">
              <Link className="dropdown-item" to="#">
                Báo cáo bán hàng
              </Link>
            </div>
          )}
        </li>

        {/* Giao dịch */}
        <li className="nav-item">
          <button
            className="nav-link"
            onClick={() => toggleDropdown("transaction")}
          >
            <FaMoneyBillTransfer size={30} className="ms-1" /> Quản lý giao dịch
          </button>
          {openDropdown === "transaction" && (
            <div className="dropdown-menu show">
              <Link className="dropdown-item" to="#">
                Danh sách giao dịch
              </Link>
            </div>
          )}
        </li>

        {/* Chat */}
        <li className="nav-item">
          <Link className="nav-link" to="#">
            <HiChatBubbleBottomCenterText size={30} className="ms-1" /> Trò
            chuyện
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidebarComponent;
