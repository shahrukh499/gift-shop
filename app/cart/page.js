"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleGetCartItems } from "./cartSlice";
import CartCard from "./CartCard";
import Subtotal from "./Subtotal";
import Image from "next/image";
import { Backdrop, Button, Skeleton } from "@mui/material";
import { handleOpenLoginModal } from "../components/header/popupSlice";
import CircularProgress from '@mui/material/CircularProgress';

function Cart() {
  // State management
  const [isClient, setIsClient] = useState(false);
  const dispatch = useDispatch();
  
  // Selectors
  const { cart, loading } = useSelector((state) => state.cartSlice);
  const { user } = useSelector((state) => state.authSlice);

  // Effects
  useEffect(() => {
    setIsClient(true);
    if (user) {
      dispatch(handleGetCartItems());
    }
  }, [user, dispatch]);

  // Render functions
  const renderLoadingState = () => (
    <section className="py-6 lg:py-12">
      <div className="container mx-auto px-2">
        <h2 className="text-[20px] lg:text-[25px] font-semibold mb-2 lg:mb-4">
          Shopping Cart
        </h2>
        <div>
          <div className="flex flex-wrap gap-y-3">
            <div className="w-full lg:w-[70%] px-1.5">
              <Skeleton variant="rectangular" sx={{maxWidth:'100%'}} width={1200} height={150} />
            </div>
            <div className="w-full lg:w-[30%] px-1.5">
              <Skeleton animation="wave" variant="rectangular" sx={{maxWidth:'100%', height:'100%'}} width={500} height={500} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderUnauthenticatedState = () => (
    <section className="py-6 lg:py-12">
      <div className="container mx-auto px-2">
        <h2 className="text-[20px] lg:text-[25px] font-semibold mb-2 lg:mb-4">
          Shopping Cart
        </h2>
        <div className="h-[44vh] flex justify-center flex-col text-center">
          <Image
            className="mx-auto mb-5"
            src="/assets/img/security-lock.png"
            alt="empty cart"
            width={200}
            height={200}
            priority
          />
          <p className="text-[20px] lg:text-[25px] font-semibold">
            <span className="text-red-600">Login</span> To View Your Cart Items
          </p>
          <div className="mt-3">
            <Button 
              onClick={() => dispatch(handleOpenLoginModal(true))} 
              variant="text"
              aria-label="Login to view cart"
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
    </section>
  );

  const renderEmptyCart = () => (
    <div className="h-[44vh] flex justify-center flex-col text-center">
      <Image
        className="mx-auto mb-5"
        src="/assets/img/empty-cart.png"
        alt="empty cart"
        width={200}
        height={200}
        priority
      />
      <p className="text-[20px] lg:text-[25px] font-semibold">
        Your Cart is <span className="text-red-600">Empty</span>
      </p>
    </div>
  );

  const renderCartItems = () => (
    <div className="flex flex-wrap">
      <div className="w-full lg:w-[70%] lg:h-[545px] overflow-x-hidden overflow-y-auto border-r border-gray-300 px-2">
        {cart?.cart?.items?.map((item, i) => (
          <div
            key={`${item?._id}-${i}`}
            className="border-1 border-gray-300 p-[8px] my-[10px]"
          >
            <CartCard
              id={item?._id}
              name={item?.products?.name}
              img={item?.products?.images[0]}
              price={item?.products?.price}
              qty={item?.quantity}
              productId={item?.products?._id}
              productSize={item?.productSize}
            />
          </div>
        ))}
      </div>
      <div className="w-full lg:w-[30%] lg:ps-3">
        <div className="px-4 py-3 h-full">
          <h2 className="text-[20px] lg:text-[20px] font-semibold mb-3">
            Payment Summary
          </h2>
          <Subtotal />
        </div>
      </div>
    </div>
  );

  const renderBackdropLoader = () => (
    <Backdrop
      sx={(theme) => ({ 
        color: '#fff', 
        zIndex: theme.zIndex.drawer + 1 
      })}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );

  // Early returns for different states
  if (!isClient) {
    return renderLoadingState();
  }

  if (!user) {
    return renderUnauthenticatedState();
  }

  // Main render
  return (
    <section className="py-6 lg:py-12">
      <div className="container mx-auto px-2 md:px-12">
        <h2 className="text-[20px] lg:text-[25px] font-semibold mb-2 lg:mb-4">
          Shopping Cart
        </h2>
        
        {renderBackdropLoader()}
        
        {cart?.cart?.items?.length > 0 ? (
          renderCartItems()
        ) : (
          renderEmptyCart()
        )}
      </div>
    </section>
  );
}

export default Cart;