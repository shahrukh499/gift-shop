"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import { handleOpenForgotPass } from "./popupSlice";
import { API_CONFIG, getApiUrl } from "@/app/utils/apiConfig";
import { showSnackbar } from "../snackbar/snackbarSlice";
import { CircularProgress } from "@mui/material";

export default function ForgotPasswordPopup() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { isForgotPass } = useSelector((state) => state.popupSlice);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(handleOpenForgotPass(false));
  };

  const handleFetchForgotPassword = async () => {
    setIsSubmitting(true);
    const payload = {
      email: email,
    };
    try {
      const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.FORGOTPASSWORD);
      const requestOptions = API_CONFIG.createRequestOptions(
        API_CONFIG.HTTP_METHODS.POST,
        payload
      );
      const response = await fetch(apiUri, requestOptions);
      const data = await response.json();
      console.log(data.message);
      if (data.status === API_CONFIG.STATUS_CODES.SUCCESS) {
        setEmail("");
        handleClose();
        dispatch(showSnackbar({ message: data.message, variant: "success" }))
        setError('')
      }else{
        setError(data.message)
      }
    } catch (error) {
      console.error(error);
    }finally{
      setIsSubmitting(false)
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={isForgotPass}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const email = formJson.email;
              console.log(email);
              handleClose();
            },
          },
        }}
      >
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To reset your password, please enter your email address here. We
            will send reset link on your email account.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <small className="text-red-500">{error}</small>
        </DialogContent>
        <DialogActions sx={{m:1}}>
          <Button 
            onClick={handleClose}
            variant="contained"
            sx={{
              fontFamily: "poppins",
              backgroundColor: "#531fd9",
            }}
          >Cancel</Button>
          <Button 
            type="button" 
            onClick={handleFetchForgotPassword}
            variant="contained"
            disabled={isSubmitting}
            sx={{
              fontFamily: "poppins",
              backgroundColor: "#531fd9",
            }}
          >
            {isSubmitting ? 
                <>
                <span className='flex items-center justify-center gap-2'>
                    <CircularProgress size='1rem' />
                    <span>Sending Link...</span>
                </span>
                </>
                : 
                "Send Link"
            }
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
