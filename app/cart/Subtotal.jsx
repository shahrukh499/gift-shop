"use client"
import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_CONFIG, getApiUrl } from "../utils/apiConfig";
import { showSnackbar } from "../components/snackbar/snackbarSlice";

function Subtotal() {
  const [code, setCode] = useState('');
  const [finalPrize, setFinalPrize] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const {cart} = useSelector((state)=> state.cartSlice);
  const dispatch = useDispatch();
  


  const cartTotalPrice = cart?.cart?.items?.reduce((acc,item)=> {
    const price = item?.products?.price || 0;
    const quantity = item?.quantity || 1;
    return acc + price * quantity;
  },0);

  

  const subTotal = Number(cartTotalPrice.toFixed(2));
  const discount = 50;
  const serviceCharge = 30;
  const shipping = 0;
  const grandTotal = subTotal + serviceCharge + shipping - discount;

  const handleApplyCoupnApi = async () => {
    if (code === appliedCode) {
      dispatch(showSnackbar({ message: "Coupon already applied", variant: "info" }));
      return;
    }
  
    const payload = {
      code: code,
      cartTotal: grandTotal,
      userId: cart?.cart?.userId
    };
  
    try {
      const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.APPLYCOUPONCODE);
      const requestOptions = API_CONFIG.createRequestOptions(
        API_CONFIG.HTTP_METHODS.POST,
        payload
      );
      const response = await fetch(apiUri, requestOptions);
      const data = await response.json();
  
      if (response.ok) {
        setFinalPrize(data.finalAmount);
        setDiscountValue(data.discount);
        setAppliedCode(code);
        dispatch(showSnackbar({ message: data.message, variant: "success" }));
      } else {
        dispatch(showSnackbar({ message: data.message, variant: "error" }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveCoupon = () => {
    setCode('');
    setFinalPrize('');
    setAppliedCode('');
    setDiscountValue(0);
    dispatch(showSnackbar({ message: "Coupon removed", variant: "info" }));
  };
  
  

  return (
    <div className="h-full relative">
      <div className="flex items-start gap-x-1 pb-4 border-b-1 border-dashed border-gray-200">
        <Box component="div" sx={{ flexGrow: 1 }}>
        <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (e.target.value.trim() === "") {
                setFinalPrize('');
                setDiscountValue(0);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleApplyCoupnApi();
              }
            }}
            type="text"
            placeholder="Coupon Code"
            className="w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          />
        </Box>
        {appliedCode && (
          <Button
            onClick={handleRemoveCoupon}
            sx={{
              bgcolor: "#ffcdd2",
              color: "#c62828",
              px: "8px",
              py: "10px",
              fontSize: "11px",
              textTransform: "capitalize",
              ml: 1
            }}
          >
            Remove
          </Button>
        )}
      </div>
      <div className="pt-5 pb-4 border-b border-gray-400 border-dashed">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600 text-[14px]">Sub Total</span>
          <span className="text-gray-600 text-[14px]">₹{subTotal}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600 text-[14px]">Discount</span>
          <span className="text-green-600 text-[14px]">-₹{discount}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600 text-[14px]">Additional Services</span>
          <span className="text-red-600 text-[14px]">+₹{serviceCharge}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600 text-[14px]">Shipping</span>
          <span className="text-gray-600 text-[14px]">₹{shipping}</span>
        </div>
      </div>
      <div className="flex justify-between items-center my-4">
        <span className="font-bold">Total</span>
        <span className="font-bold">₹{finalPrize || grandTotal}</span>
      </div>
      <div className="lg:absolute bottom-11 w-full">
        <Button
          sx={{
            borderRadius:0,
            py:'10px',
            width: "100%",
            backgroundColor: "#9c27b0",
            color: "#FFF",
            textTransform: "capitalize",
          }}
        >
          Checkout Now
        </Button>
      </div>
    </div>
  );
}

export default Subtotal;
