"use client";

import { API_CONFIG, getApiUrl } from "@/app/utils/apiConfig";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProductDetailsImages from "../ProductDetailsImages";
import {
  Button,
  Checkbox,
  Rating,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import AddCartsButton from "@/app/components/products/AddCartsButton";
import Image from "next/image";

function ProductDetails() {
  // State management
  const [products, setProducts] = useState(null);
  const [size, setSize] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Get product slug from URL
  const slug = usePathname();
  const productUrl = slug.split("/")[2];

  // Data fetching
  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const apiUri = getApiUrl(
          `${API_CONFIG.ENDPOINTS.PRODUCTDETAILS}/${productUrl}`
        );
        const requestOptions = API_CONFIG.createRequestOptions(
          API_CONFIG.HTTP_METHODS.GET
        );

        const response = await fetch(apiUri, requestOptions);
        
        /* if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } */
        
        const data = await response.json();

        if (data.status === API_CONFIG.STATUS_CODES.SUCCESS) {
          setProducts(data);
        } else {
          setError("Product not found");
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productUrl]);

  // Event handlers
  const handleSizeSelection = (event, newSize) => {
    if (newSize !== null) {
      setSize(newSize);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  //button style
  const btnStyle = {
    color:'#ffffff',
    backgroundColor:'#9c27b0',
    border:'0',
    width:'100%',
    display:'flex',
    alignItems:'start',
    gap:'5px',
    textTransform:'capitalize'
  }

  // Helper functions
  const renderPriceSection = () => (
    <div className="flex items-center gap-x-2 mb-3">
      <span className="text-[25px] flex items-center">
        <CurrencyRupeeIcon sx={{ fontSize: "18px" }} />
        {products?.product.price}
      </span>
      <span className="text-gray-400 line-through flex items-center">
        <CurrencyRupeeIcon sx={{ fontSize: "14px" }} />
        339
      </span>
      <span className="bg-[#dfb2e7db] text-[#9c27b0] font-semibold py-[2px] px-3 rounded-lg">
        3%
      </span>
    </div>
  );

  const renderSizeSelector = () => (
    <div className="mb-3 max-w-full">
      <p>Select Size</p>
      <ToggleButtonGroup
        value={size}
        exclusive
        onChange={handleSizeSelection}
        aria-label="size selection"
      >
        {products?.product.sizes.map((ele, i) => (
          <ToggleButton
            key={i}
            value={ele.label}
            aria-label={ele.label}
            disabled={!ele.available}
            sx={{
              px: 3,
              py: 1,
              mr: 1,
              width: { xs:'60px', lg: '70px' },
              border: '1px solid',
              borderLeft: '1px solid #bdbdbd !important',
              borderColor: 'grey.400',
              borderRadius: 0,
              textTransform: 'uppercase',
              fontWeight: 'bold',
              color: ele.available ? 'text.primary' : 'grey.500', 
              '&.Mui-selected': {
                backgroundColor: '#9c27b0',
                color: '#fff',
                borderRadius: '5px',
                '&:hover': {
                  backgroundColor: '#9c27b0',
                },
              },
              '&:hover': {
                backgroundColor: 'grey.100',
              },
              '&.Mui-disabled': {
                borderColor: 'grey.300',
                cursor: 'not-allowed',
                borderRadius: '0px'
              },
            }}
          >
            {ele.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );

  const renderActionButtons = () => (
    <div className="max-w-full w-[500px] flex items-center gap-x-1">
      <AddCartsButton 
        products={productUrl} 
        productSize={size}
        disabled={!size} // Disable if no size selected
        btnStyle={btnStyle}
      />
      <Checkbox
        color="secondary"
        icon={<FavoriteBorder />}
        checkedIcon={<Favorite />}
        checked={isFavorite}
        onChange={toggleFavorite}
      />
    </div>
  );

  // Loading and error states
  if (isLoading) {
    return (
      <section className="py-6">
        <div className="container mx-auto px-2 md:px-12">
          <div className="flex flex-wrap gap-y-3">
            <div className="w-full lg:w-[50%] px-1.5">
              <Skeleton variant="rectangular" sx={{maxWidth:'100%'}} width={1000} height={550} />
            </div>
            <div className="w-full lg:w-[50%] px-1.5">
              <Skeleton variant="text" sx={{ fontSize: '2rem', maxWidth:'100%' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', maxWidth:'30%' }} />
              <Skeleton variant="text" sx={{ fontSize: '1.5rem', maxWidth:'20%' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', maxWidth:'100%' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', maxWidth:'100%' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', maxWidth:'100%' }} />
              <Skeleton variant="text" sx={{ fontSize: '3rem', maxWidth:'30%' }} />
              <div className="flex items-center w-full gap-x-1">
                <Skeleton variant="rectangular" sx={{maxWidth:'100%'}} width={40} height={40} />
                <Skeleton variant="rectangular" sx={{maxWidth:'100%'}} width={40} height={40} />
                <Skeleton variant="rectangular" sx={{maxWidth:'100%'}} width={40} height={40} />
                <Skeleton variant="rectangular" sx={{maxWidth:'100%'}} width={40} height={40} />
                <Skeleton variant="rectangular" sx={{maxWidth:'100%'}} width={40} height={40} />
              </div>
              <div className="flex items-center w-full gap-x-1">
                <Skeleton variant="text" sx={{ fontSize: '3rem', maxWidth:'80%', width:'500px' }} />
                <Skeleton variant="text" sx={{ fontSize: '3rem', maxWidth:'100%', width:'50px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-6">
        <div className="container mx-auto px-2 md:px-12">
          <div className="h-[58vh] flex justify-center items-center flex-col">
              <Image src='/assets/img/bag.png' alt="bag" width={100} height={100} />
              <p className="mt-3">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (products?.status !== 0) {
    return (
      <section className="pt-6">
        <div className="container mx-auto px-2 md:px-12">
          <div className="h-[58vh] flex justify-center items-center flex-col">
              <Image src='/assets/img/bag.png' alt="bag" width={100} height={100} />
              <p className="mt-3">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Main render
  return (
    <section className="py-6">
      <div className="container mx-auto px-2 md:px-12">
        <div className="flex flex-wrap gap-y-3">
          {/* Product Images */}
          <div className="w-full lg:w-[60%] xl:w-[50%] md:px-1.5">
            <ProductDetailsImages productImg={products} />
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-[40%] xl:w-[50%] md:px-1.5">
            <div>
              <h2 className="text-[25px] lg:text-[30px] font-semibold leading-tight">
                {products?.product.name}
              </h2>
            </div>
            
            <div className="flex items-center gap-x-2 my-3">
              <Rating
                name="half-rating-read"
                defaultValue={2.5}
                precision={0.5}
                size="small"
                readOnly
              />
              <small className="text-gray-500">42 reviews</small>
            </div>
            
            <div className="mb-3 max-w-full w-[500px]">
              <p>Description & Fit</p>
              <p className="text-[15px] text-gray-500">
                {products?.product.description}
              </p>
            </div>
            
            {renderPriceSection()}
            {renderSizeSelector()}
            {renderActionButtons()}
          </div>
        </div>
        {/* <div className="pt-6">
          <h2>hello</h2>
        </div> */}
      </div>
    </section>
  );
}

export default ProductDetails;
