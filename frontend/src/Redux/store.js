import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice.js";
import purchaseReducer from "./purchase.js"
const store = configureStore({
  reducer: {
    auth: authReducer,
    purchase: purchaseReducer,
  },
});

export default store;
