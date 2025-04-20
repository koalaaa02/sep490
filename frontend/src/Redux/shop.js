import { createSlice } from "@reduxjs/toolkit";
export const shopSlice = createSlice({
  name: "shop",
  initialState: {
    shopId: ""
  },

  reducers: {
    setShopId : (state, action) =>{
      state.shopId = action.payload
    }
  },
});
export const {setShopId} = shopSlice.actions;
export default shopSlice.reducer;
