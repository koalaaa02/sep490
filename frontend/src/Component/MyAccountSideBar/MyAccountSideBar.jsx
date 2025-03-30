import { Link } from "react-router-dom";

const MyAccountSideBar = ({ activeKey }) => {
  const handleLogOut = () => {
    // Handle logout functionality here
  };

  return (
    <div className="col-lg-3 col-md-4 col-12 border-end d-none d-md-block">
      <div className="pt-10 pe-lg-10">
        {/* nav */}
        <ul className="nav flex-column nav-pills nav-pills-dark">
          {/* nav item */}
          <li className="nav-item">
            <Link
              className={`nav-link ${
                activeKey === "MyAccountOrder" && "active"
              }`}
              aria-current="page"
              to="/MyAccountOrder"
            >
              <i className="fas fa-shopping-bag me-2" />
              Đơn đặt hàng của bạn
            </Link>
          </li>
          {/* nav item */}
          <li className="nav-item">
            <Link
              className={`nav-link ${
                activeKey === "MyAccountSetting" && "active"
              }`}
              to="/MyAccountSetting"
            >
              <i className="fas fa-cog me-2" />
              Cài đặt
            </Link>
          </li>
          {/* nav item */}
          <li className="nav-item">
            <Link
              className={`nav-link ${activeKey === "MyDebt" && "active"}`}
              to="/MyDebt"
            >
              <i className="fas fa-credit-card me-2" />
              Khoản nợ của bạn
            </Link>
          </li>
          {/* nav item */}
          <li className="nav-item">
            <Link
              className={`nav-link ${
                activeKey === "MyAccountAddress" && "active"
              }`}
              to="/MyAccountAddress"
            >
              <i className="fas fa-map-marker-alt me-2" />
              Địa chỉ
            </Link>
          </li>
          {/* nav item */}
          {/* <li className="nav-item">
            <Link
              className={`nav-link ${
                activeKey === "MyAccountPaymentMethod" && "active"
              }`}
              to="/MyAcconutPaymentMethod"
            >
              <i className="fas fa-credit-card me-2" />
              Phương thức thanh toán
            </Link>
          </li> */}
          {/* nav item */}
          <li className="nav-item">
            <Link
              className={`nav-link ${
                activeKey === "MyAccountInvoice" && "active"
              }`}
              to="/MyAcconutInvoice"
            >
              <i className="fas fa-bell me-2" />
              Hóa đơn của tôi
            </Link>
          </li>
          {/* nav item */}
          <li className="nav-item">
            <hr />
          </li>
          {/* nav item */}
          <li className="nav-item">
            <button className="nav-link" onClick={handleLogOut}>
              <i className="fas fa-sign-out-alt me-2" />
              Đăng Xuất
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MyAccountSideBar;
