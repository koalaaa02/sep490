import React from "react";
import AdminSideBar from "../../Component/AdminComponent/AdminSidebar.tsx";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { useState } from "react";
import AdminDashboard from "../../Component/AdminComponent/AdminContent/AdminDashboard.tsx";
import AdminCate from "../../Component/AdminComponent/AdminContent/AdminCate.tsx";
import AdminProd from "../../Component/AdminComponent/AdminContent/AdminProd.tsx";
import AdminDealer from "../../Component/AdminComponent/AdminContent/AdminDealer.tsx";
import AdminProvider from "../../Component/AdminComponent/AdminContent/AdminProvider.tsx";

const Admin = () => {
  const [active, setActive] = useState("Dashboard");
  const renderComponent = () => {
    switch (active) {
      case "Dashboard":
        return <AdminDashboard />;
      case "Categories":
        return <AdminCate />;
      case "Products":
        return <AdminProd />;
      case "Dealers":
        return <AdminDealer />;
      case "Providers":
        return <AdminProvider />;
      default:
        return <AdminDashboard />;
    }
  };
  return (
    <Row className="w-100 vh-100">
      <Col md={3} lg={2} className="bg-light ">
        <AdminSideBar active={active} setActive={setActive} />
      </Col>
      <Col md={9} lg={10} className="">
        {renderComponent()}
      </Col>
    </Row>
  );
};

export default Admin;
