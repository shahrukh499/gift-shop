import { IconButton } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { API_CONFIG, getApiUrl } from '@/app/utils/apiConfig';
import { showSnackbar } from '../snackbar/snackbarSlice';
import { handleGetCartItems } from '@/app/cart/cartSlice';

function DeleteButton(props) {
    const dispatch = useDispatch();
    const deleteCartItem = async (id) => {
        try {
            const apiUri = getApiUrl(`${API_CONFIG.ENDPOINTS.ADDTOCART}/${id}`);
            console.log(apiUri,'apiUri');
            const requestOptions = API_CONFIG.createRequestOptions(
            API_CONFIG.HTTP_METHODS.DELETE,
            );
            const response = await fetch(apiUri, requestOptions);
            const data = await response.json();

            if (data.status === API_CONFIG.STATUS_CODES.SUCCESS) {
            dispatch(showSnackbar({message: data.message, variant: "success"}));
            dispatch(handleGetCartItems());
            }
        } catch (e) {
            console.error("Error adding item to cart:", e);
        }
    };
  return (
    <IconButton onClick={()=>deleteCartItem(props.id)} sx={{ p:'3px', display:"flex", justifyContent:"end"}}>
        <CloseIcon
            fontSize='small'
         />
    </IconButton>
  )
}

export default DeleteButton
