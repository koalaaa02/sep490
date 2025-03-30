import React from "react";
import TopSellingProduct from "./ProviderDashboardDetailComponent/TopSellingProduct.tsx";
import ProviderPeriod from "./ProviderDashboardDetailComponent/ProviderPeriod.tsx";
import ProviderInventory from "./ProviderDashboardDetailComponent/ProviderInventory.tsx";
import ProviderOutOfStock from "./ProviderDashboardDetailComponent/ProviderOutOfStock.tsx";
import ProviderNearlyOutOfStock from "./ProviderDashboardDetailComponent/ProviderNearlyOutOfStock.tsx";
import { Row, Col } from "react-bootstrap";

const ProviderDashBoardDetail = () => {
  return (
    <div className="w-100 mt-3">
      <Row>
        <Col>
          <TopSellingProduct />
        </Col>
        <Col>
          <ProviderInventory />
          <ProviderNearlyOutOfStock />
          <ProviderOutOfStock />
        </Col>
      </Row>

      <ProviderPeriod />
    </div>
  );
};

export default ProviderDashBoardDetail;
