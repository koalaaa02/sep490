// react
import React from "react";
// css
import "./App.css";
// browserrouter
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Components
import Header from "./Component/Header";
import Footer from "./Component/Footer";
// pages
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
// Provider
import ProviderDashBoard from "./pages/Provider/ProviderDashBoard";
import MyDebt from "./pages/Accounts/MyDebt/MyDebt";
import Admin from "./pages/Admin/Admin.tsx";

const App = () => {
  const userInfo = JSON.parse(localStorage.getItem("user"));
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          {userInfo?.roles === "ROLE_ADMIN" ? (
            <Route path="/" element={<Admin />} />
          ) : (
            <Route path="/" element={<Home />} />
          )}

          {/* <Route path="/" element={<Admin />} /> */}

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
          {/* Accounts pages */}
          <Route path="/MyAccountOrder" element={<MyAccountOrder />} />
          <Route path="/MyAccountSetting" element={<MyAccountSetting />} />
          <Route path="/MyAcconutInvoice" element={<MyAcconutInvoice />} />
          <Route
            path="/MyAcconutPaymentMethod"
            element={<MyAcconutPaymentMethod />}
          />
          {/* <Route
            path="/MyAcconutNotification"
            element={<MyAcconutNotification />}
          /> */}
          <Route
            path="/MyAcconutPaymentMethod"
            element={<MyAcconutPaymentMethod />}
          />
          <Route path="/MyAccountAddress" element={<MyAccountAddress />} />
          <Route
            path="/MyAccountForgetPassword"
            element={<MyAccountForgetPassword />}
          />
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
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
