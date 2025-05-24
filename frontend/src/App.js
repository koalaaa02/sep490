// react
import React, { useState, useEffect } from "react";
// css
import "./App.css";
// react-router
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
// redux
import { useSelector } from "react-redux";
// Components
import Header from "./Component/Header";
import Footer from "./Component/Footer";
// Pages
import Home from "./pages/Home";
// About pages
import AboutUs from "./pages/About/AboutUs";
import Blog from "./pages/About/Blog";
import BlogCategory from "./pages/About/BlogCategory";
import Contact from "./pages/About/Contact";
// Shop pages
import Shop from "./pages/Shop/Shop";
import ShopGridCol3 from "./pages/Shop/ShopGridCol3";
import ShopListCol from "./pages/Shop/ShopListCol";
import ShopCart from "./pages/Shop/ShopCart";
import ShopCheckOut from "./pages/Shop/ShopCheckOut";
import ShopWishList from "./pages/Shop/ShopWishList";
// Store pages
import StoreList from "./pages/store/StoreList";
import SingleShop from "./pages/store/SingleShop";
// Account pages
import MyAccountOrder from "./pages/Accounts/MyAccountOrder";
import MyAccountSetting from "./pages/Accounts/MyAcconutSetting";
import MyAcconutInvoice from "./pages/Accounts/MyAcconutInvoice";
import MyAcconutPaymentMethod from "./pages/Accounts/MyAcconutPaymentMethod";
import MyAccountAddress from "./pages/Accounts/MyAccountAddress";
import MyAccountForgetPassword from "./pages/Accounts/MyAccountForgetPassword";
import MyAccountSignIn from "./pages/Accounts/MyAccountSignIn";
import MyAccountSignUp from "./pages/Accounts/MyAccountSignUp";
// Provider pages
import ProviderDashBoard from "./pages/Provider/ProviderDashBoard";
import MyDebt from "./pages/Accounts/MyDebt/MyDebt";
// Admin page
import Admin from "./pages/Admin/Admin.tsx";
// Payment result
import PaymentResult from "./pages/PaymentResult.jsx";

const AppContent = () => {
  const userInfo = useSelector((state) => state.auth.user);
  const location = useLocation();

  const [showHeaderFooter, setShowHeaderFooter] = useState(true);

  useEffect(() => {
    if (location.pathname === "/payment-result") {
      setShowHeaderFooter(false);
    } else {
      setShowHeaderFooter(true);
    }
  }, [location.pathname]);

  const handleShowHeaderFooter = () => {
    setShowHeaderFooter(true);
  };

  if (userInfo?.roles === "ROLE_ADMIN") {
    return (
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/MyAccountSignIn" element={<MyAccountSignIn />} />
      </Routes>
    );
  }

  return (
    <>
      {showHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Shop pages */}
        <Route path="/Shop/:cateId" element={<Shop />} />
        <Route path="/ShopGridCol3/:cateId" element={<ShopGridCol3 />} />
        <Route path="/ShopListCol/:cateId" element={<ShopListCol />} />
        <Route path="/ShopWishList" element={<ShopWishList />} />
        <Route path="/ShopCheckOut" element={<ShopCheckOut />} />
        <Route path="/ShopCart" element={<ShopCart />} />
        {/* Store pages */}
        <Route path="/StoreList" element={<StoreList />} />
        <Route path="/SingleShop/:shopId" element={<SingleShop />} />
        {/* Account pages */}
        <Route path="/MyAccountOrder" element={<MyAccountOrder />} />
        <Route path="/MyAccountSetting" element={<MyAccountSetting />} />
        <Route path="/MyAcconutInvoice" element={<MyAcconutInvoice />} />
        <Route path="/MyAcconutPaymentMethod" element={<MyAcconutPaymentMethod />} />
        <Route path="/MyAccountAddress" element={<MyAccountAddress />} />
        <Route path="/MyAccountForgetPassword" element={<MyAccountForgetPassword />} />
        <Route path="/MyAccountSignIn" element={<MyAccountSignIn />} />
        <Route path="/MyAccountSignUp" element={<MyAccountSignUp />} />
        <Route path="/MyDebt" element={<MyDebt />} />
        {/* About pages */}
        <Route path="/Blog" element={<Blog />} />
        <Route path="/BlogCategory" element={<BlogCategory />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        {/* Provider */}
        <Route path="/ProviderDashBoard" element={<ProviderDashBoard />} />
        {/* Payment Result */}
        <Route
          path="/payment-result"
          element={<PaymentResult onConfirm={handleShowHeaderFooter} />}
        />
      </Routes>
      {showHeaderFooter && <Footer />}
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
