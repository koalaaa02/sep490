import React from "react";
import TopSellingProduct from "./ProviderDashboardDetailComponent/TopSellingProduct.tsx";
import ProviderPeriod from "./ProviderDashboardDetailComponent/ProviderPeriod.tsx";
import ProviderInventory from "./ProviderDashboardDetailComponent/ProviderInventory.tsx";
import ProviderOutOfStock from "./ProviderDashboardDetailComponent/ProviderOutOfStock.tsx";
import ProviderNearlyOutOfStock from "./ProviderDashboardDetailComponent/ProviderNearlyOutOfStock.tsx";
import { Row, Col } from "react-bootstrap";

const ProviderDashBoardDetail = () => {
  return (
    <div className="w-100 mt-3 mb-5">
      <Col>
        <Row>
          <Col>
            <ProviderInventory />
          </Col>
          <Col>
            <ProviderNearlyOutOfStock />
          </Col>
          <Col>
            <ProviderOutOfStock />
          </Col>
        </Row>
        <Row>
          <Col>
            <TopSellingProduct />
          </Col>
          <Col>
            <ProviderPeriod />
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default ProviderDashBoardDetail;
