"use client";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import IncrementButton from "../components/products/IncrementButton";
import DecrementButton from "../components/products/DecrementButton";
import DeleteButton from "../components/products/DeleteButton";
import Link from "next/link";

function CartCard(props) {

  return (
    <div className="flex gap-x-1 md:gap-x-2">
      <div>
      <Link href={`products/${props.productId}`}>
        <Image
          className="max-w-full w-[150px] h-auto lg:w-[150px] lg:h-[150px] object-cover rounded-[8px]"
          src={props.img}
          alt=""
          width={400}
          height={400}
        />
      </Link>
      </div>
      <div className="w-[70%] md:w-[80%]">
        <div className="lg:flex gap-x-[5px] md:gap-x-[100px]">
          <div>
            <div className="max-w-full xl:w-[350px]">
              <h3 className="text-[15px] md:text-[20px] font-semibold line-clamp-1">
              <Link href={`products/${props.productId}`}>
                {props.name}
              </Link>
              </h3>
            </div>
            <p className="text-[12px] md:text-[15px]">Blue | Size : {props.productSize}</p>
            <p className="text-[15px] md:text-[15px] flex items-center"><CurrencyRupeeIcon sx={{fontSize:'16px'}}/>{props.price}</p>
          </div>
          <div className="lg:mt-2">
            <p className="lg:text-center font-semibold text-[12px] lg:text-[15px]">
              Quantity
            </p>
            <div className="flex items-center">
              <DecrementButton
                productId={props.productId}
                productSize={props.productSize}
              />
              <input
                readOnly
                className="w-[37px] h-5 text-center my-2 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                type="number"
                value={props.qty}
              />
             <IncrementButton
               productId={props.productId}
               productSize={props.productSize}
             />
            </div>
          </div>
        </div>
      </div>
      <Box component="div" className="w-[10%] flex justify-end items-start">
        <DeleteButton
          id={props.id}
        />
      </Box>
    </div>
  );
}

export default CartCard;
