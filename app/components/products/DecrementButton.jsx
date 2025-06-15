import { IconButton } from '@mui/material'
import React from 'react'
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch, useSelector } from 'react-redux';
import { handleGetCartItems } from '@/app/cart/cartSlice';
import { API_CONFIG, getApiUrl } from '@/app/utils/apiConfig';

function DecrementButton(props) {
    const {cart} = useSelector((state)=> state.cartSlice);
    const dispatch = useDispatch();
    const handleDecrementApi = async (id) =>{
        const payload = {
          userId:cart?.cart?.userId,
          productId: id,
          productSize: props.productSize
        }
        try{
          const apiUri = getApiUrl(`${API_CONFIG.ENDPOINTS.DECREMENTCARTITEM}`);
          console.log(apiUri,'apiUri');
          const requestOptions = API_CONFIG.createRequestOptions(
            API_CONFIG.HTTP_METHODS.POST,
            payload
          );
          const response = await fetch(apiUri, requestOptions);
          const data = await response.json();
          if (data.status === API_CONFIG.STATUS_CODES.SUCCESS) {
            dispatch(handleGetCartItems());
          }
        }catch(e){
          console.log(e.message);
        }
      }

  return (
    <IconButton onClick={()=>handleDecrementApi(props.productId)}>
        <RemoveIcon sx={{color:"#9c27b0"}} fontSize="small"/>
    </IconButton>
  )
}

export default DecrementButton
