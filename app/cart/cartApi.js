import { API_CONFIG, getApiUrl } from "../utils/apiConfig";

export const addToCart = async (products, productSize, quantity, enqueueSnackbar) => {
  const payload = {
    products,
    quantity,
    productSize
  };
  try {
    const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.ADDTOCART);
    const requestOptions = API_CONFIG.createRequestOptions(
      API_CONFIG.HTTP_METHODS.POST,
      payload
    );

    const response = await fetch(apiUri, requestOptions);
    const data = await response.json();
    if (data.status === API_CONFIG.STATUS_CODES.SUCCESS) {
      enqueueSnackbar(data.message, { variant: "success" });
      return data.item;
    } else {
      enqueueSnackbar(data.message, { variant: "error" });
    }
  } catch (e) {
    console.error("Error adding item to cart:", e);
  }
};
