import React, { useState } from "react";
import { BiTask } from "react-icons/bi";
import { RiShoppingCart2Line } from "react-icons/ri";
import { FaClipboardList, FaChartBar } from "react-icons/fa";
import { HiChatBubbleBottomCenterText } from "react-icons/hi2";

const SidebarComponent = ({ setSelectedComponent }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div
      className="d-flex flex-column p-3 bg-light"
      style={{ width: "250px", height: "100%" }}
    >
      <ul className="nav flex-column navbar-nav navbar-light">
        {/* Quản lý sản phẩm */}
        <li>
          <button
            className="nav-link"
            onClick={() => setSelectedComponent("ProviderDashBoardDetail")}
          >
            <FaChartBar size={30} className="ms-1" /> Thống kê
          </button>
        </li>
        {/* Quản lý sản phẩm */}
        <li>
          <button
            className="nav-link"
            onClick={() => toggleDropdown("product")}
          >
            <RiShoppingCart2Line size={30} className="ms-1" /> Cửa hàng của tôi
          </button>
          {openDropdown === "product" && (
            <div className="dropdown-menu show">
              <button
                className="dropdown-item"
                onClick={() => setSelectedComponent("ProductList")}
              >
                Danh sách sản phẩm
              </button>
              <button
                className="dropdown-item"
                onClick={() => setSelectedComponent("AddProduct")}
              >
                Thêm sản phẩm
              </button>
            </div>
          )}
        </li>
        {/* Hóa đơn */}
        <li>
          <button
            className="nav-link"
            onClick={() => toggleDropdown("invoice")}
          >
            <BiTask size={30} className="ms-1" /> Khoản nợ
          </button>
          {openDropdown === "invoice" && (
            <div className="dropdown-menu show">
              <button
                className="dropdown-item"
                onClick={() => setSelectedComponent("InvoiceManagement")}
              >
                Danh sách khoản nợ
              </button>
            </div>
          )}
        </li>

        {/* Đặt hàng */}
        <li>
          <button className="nav-link" onClick={() => toggleDropdown("order")}>
            <FaClipboardList size={30} className="ms-1" /> Đặt hàng
          </button>
          {openDropdown === "order" && (
            <div className="dropdown-menu show">
              <button
                className="dropdown-item"
                onClick={() => setSelectedComponent("OrderList")}
              >
                Danh sách đặt hàng
              </button>
              <button
                className="dropdown-item"
                onClick={() => setSelectedComponent("DeliveryList")}
              >
                Phiếu giao hàng
              </button>
            </div>
          )}
        </li>

        {/* Báo cáo */}
        {/* <li>
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
        </li> */}

        {/* Giao dịch */}
        {/* <li>
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
        </li> */}

        {/* Chat */}
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
