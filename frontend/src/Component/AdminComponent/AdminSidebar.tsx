import React from "react";
import { Nav } from "react-bootstrap";
import { CiLogout } from "react-icons/ci";
import { logout } from "../../Redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const AdminSideBar = ({ setActive, active }) => {
  const navLink = [
    "Thống kê",
    "Danh mục",
    "Sản phẩm",
    "Người dùng",
    "Tài Khoản",
    "Nhà cung cấp",
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogOut = () => {
    dispatch(logout());
    navigate("/");
    window.location.reload();
  };
  return (
    <Nav className="flex-column sticky-top h-100 " variant="pills">
      {navLink.map((n) => (
        <Nav.Item className="p-2 ">
          <Nav.Link
            style={{ outline: "none", boxShadow: "none" }}
            className={` ${active === n ? "bg-warning" : ""} text-black`}
            active={active === n}
            onClick={() => setActive(n)}
          >
            {n}
          </Nav.Link>
        </Nav.Item>
      ))}{" "}
      <Nav.Item className="p-2 " onClick={handleLogOut}>
        <Nav.Link style={{ outline: "none", boxShadow: "none" }}>
          <CiLogout size={25} />
          <span className="ml-2 text-black">Đăng xuất</span>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default AdminSideBar;
