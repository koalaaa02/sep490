import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice.js";
import purchaseReducer from "./purchase.js"
import shopSlice from "./shop.js";
const store = configureStore({
  reducer: {
    auth: authReducer,
    purchase: purchaseReducer,
    shop: shopSlice,
  },
});

export default store;
