import React from "react";
import Link from "next/link";
import { addToCart } from "@/app/cart/cartApi";
import { handleGetCartItems } from "@/app/cart/cartSlice";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "../snackbar/snackbarSlice";
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';

function AddCartsButton({ products, productSize, btnStyle }) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authSlice);
  const { cart } = useSelector((state) => state.cartSlice);

  const existingItem = cart?.cart?.items?.some(
    (item) => item?.products?._id === products && item?.productSize === productSize
  );

  const handleCartButton = async () => {
    try {
      if (!user) {
        dispatch(showSnackbar({message:'You must Log In first', variant:"warning"}))
        return;
      }
      await addToCart(products, productSize, 1, enqueueSnackbar);
      dispatch(handleGetCartItems());
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <>
      {existingItem ? (
          <Link className="w-full" href="/cart">
            <Button sx={btnStyle} variant="outlined"><LocalMallOutlinedIcon fontSize="small"/> Go to cart</Button>
          </Link>
        ) : (
          <Button sx={btnStyle} onClick={handleCartButton} variant="outlined" >
            <LocalMallOutlinedIcon fontSize="small"/> Add to cart
          </Button>
      )}
    </>
  );
}

export default AddCartsButton;
