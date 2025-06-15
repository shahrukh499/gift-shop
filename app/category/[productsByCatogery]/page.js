"use client";
import { API_CONFIG, getApiUrl } from "@/app/utils/apiConfig";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function ProductsByCatogery() {
  const [products, setProducts] = useState([]);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProductDetailsByCategory = async () => {
      try {
        const queryParams = searchParams.toString();
        if (!queryParams) return;
        const apiUri = getApiUrl(
         `${API_CONFIG.ENDPOINTS.PRODUCTDETAILS}?${queryParams}`
        );

        const requestOptions = API_CONFIG.createRequestOptions(
          API_CONFIG.HTTP_METHODS.GET
        );

        const response = await fetch(apiUri, requestOptions);
        const data = await response.json();

        if (data.status === API_CONFIG.STATUS_CODES.SUCCESS) {
          setProducts(data);
        } else {
          alert("Product Not Found");
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchProductDetailsByCategory();
  }, [searchParams]);

  return (
    <div>
      <h2>Product List</h2>
      {products?.products?.length > 0 ? (
        <ul>
          {products?.products?.map((items,i) => (
            <li key={i}>
              {items.name} - ${items.price}
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}

export default ProductsByCatogery;
