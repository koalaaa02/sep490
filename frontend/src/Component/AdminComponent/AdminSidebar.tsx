import React from "react";
import { Nav } from "react-bootstrap";
const AdminSideBar = ({ setActive, active }) => {
  const navLink = [
    "Dashboard",
    "Categories",
    "Products",
    "Dealers",
    "Providers",
  ];
  return (
    <Nav className="flex-column focus sticky-top h-100 " variant="pills">
      {navLink.map((n) => (
        <Nav.Item className="p-2 ">
          <Nav.Link
            style={{ outline: "none", boxShadow: "none" }}
            className={` ${active === n ? "bg-warning" : ""}`}
            active={active === n}
            onClick={() => setActive(n)}
          >
            {n}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default AdminSideBar;
