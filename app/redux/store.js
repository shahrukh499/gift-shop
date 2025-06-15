import { configureStore } from "@reduxjs/toolkit";
import popupSlice from "@/app/components/header/popupSlice";
import authSlice from "@/app/components/header/authSile";
import cartSlice from "@/app/cart/cartSlice"
import snackbarSlice from "@/app/components/snackbar/snackbarSlice"

export const store = configureStore({
    reducer: {
        popupSlice,
        authSlice,
        cartSlice,
        snackbarSlice,
    }
})