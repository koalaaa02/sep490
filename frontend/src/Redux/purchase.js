import { createSlice } from "@reduxjs/toolkit";
export const purchaseSlice = createSlice({
  name: "purchase",
  initialState: {
    bank: ""
  },

  reducers: {
    setBank : (state, action) =>{
      state.bank = action.payload
    }
  },
});
export const {setBank} = purchaseSlice.actions;
export default purchaseSlice.reducer;
