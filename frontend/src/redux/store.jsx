import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/userSlice";
import adminReducer from "./Slices/adminSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
  },
});

export default store;
