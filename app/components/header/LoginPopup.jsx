"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { API_CONFIG, getApiUrl } from "@/app/utils/apiConfig";
import { useDispatch, useSelector } from "react-redux";
import { setLocalStorageData, setUser } from "./authSile";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  Tooltip,
} from "@mui/material";
import { handleOpenForgotPass, handleOpenLoginModal, handleOpenSignupModal } from "./popupSlice";
import { showSnackbar } from "../snackbar/snackbarSlice";
import { handleGetCartItems } from "@/app/cart/cartSlice";
import ForgotPasswordPopup from "./ForgotPasswordPopup";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function LoginPopup() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  let ref = React.useRef();
  const dispatch = useDispatch();
  const {isLoginOpen} = useSelector((state)=> state.popupSlice)

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleClickOpen = () => {
    dispatch(handleOpenLoginModal(true))
  };

  const handleClose = () => {
    dispatch(handleOpenLoginModal(false))
  };


  //login api fetching
  const handleFetchLogin = async (e) => {
    e.preventDefault();
    const payload = {
      email: email,
      password: password,
    };
    try {
      const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.LOGIN);
      const requestOptions = API_CONFIG.createRequestOptions(
        API_CONFIG.HTTP_METHODS.POST,
        payload
      );
      const response = await fetch(apiUri, requestOptions);
      const data = await response.json();

      if (data.status === API_CONFIG.STATUS_CODES.SUCCESS) {
        const loginData = {
          isLoggedIn: true,
          token: data.token,
          username: data.username,
        };
        dispatch(setLocalStorageData(loginData));
        dispatch(setUser(loginData));
        dispatch(showSnackbar({ message: data.message, variant: "success" }))
        dispatch(handleGetCartItems());
        handleClose();
      } else {
        dispatch(showSnackbar({ message: data.message, variant: "error" }))

      }
    } catch (error) {
      console.log(error);
      dispatch(showSnackbar({ message: data.message, variant: "error" }))
    }
  };

  return (
    <React.Fragment>
      <Tooltip title="Login">
        <IconButton
          onClick={handleClickOpen}
          color="inherit"
          sx={{ padding: "5px" }}
        >
          <PersonOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={isLoginOpen}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        maxWidth="md"
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        {/* <DialogTitle>{"Use Google's location service?"}</DialogTitle> */}
        <div className="absolute top-0 right-0 z-[99]">
          <Button
            variant="text"
            onClick={handleClose}
            sx={{ minWidth: "45px" }}
          >
            <CloseIcon />
          </Button>
        </div>
        <DialogContent sx={{ padding: 0 }}>
          <div className="flex flex-wrap">
            <div className="w-full md:w-[55%] hidden md:block">
              <Image
                src="/assets/img/1000x1000.webp"
                alt=""
                width={1000}
                height={1000}
              />
            </div>
            <div className="w-full md:w-[45%] px-10">
              <div className="pt-14 pb-10">
                <Image
                  className="block mx-auto"
                  src="/assets/img/logo.svg"
                  alt=""
                  width={100}
                  height={100}
                />
              </div>
              <div className="mb-4">
                <h4 className="text-center">Welcome to Clouth Store</h4>
              </div>
              <form
                ref={ref}
                onSubmit={(e) => {
                  handleFetchLogin(e);
                  ref.current.reset();
                }}
              >
                <TextField
                  type="email"
                  id="standard-basic"
                  label="Email"
                  variant="standard"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormControl
                  sx={{ width: "100%", mt: "15px" }}
                  variant="standard"
                >
                  <InputLabel htmlFor="standard-adornment-password">
                    Password
                  </InputLabel>
                  <Input
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="standard-adornment-password"
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {/* <button type="button" className="flex justify-center text-[14px] mt-2">Forgot Password</button> */}
                </FormControl>
                <div className="mb-5 mt-1">
                  <Button
                    onClick={()=> dispatch(handleOpenForgotPass(true))}
                    variant="text"
                    sx={{
                      display: "block",
                      marginLeft: "auto",
                      padding: 0,
                      fontSize: "12px",
                      textTransform: "capitalize",
                    }}
                  >
                    Forgot Password
                  </Button>
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    width: "100%",
                    fontFamily: "poppins",
                    backgroundColor: "#531fd9",
                  }}
                >
                  Sign In
                </Button>
              </form>
              <div className="my-5 bg-[#b9b9b9] h-[1px] max-w-full w-[500px] mx-auto"></div>
              <div className="flex justify-center items-center gap-x-0.5">
                <span>Dont have an account?</span>
                <Button variant="text" onClick={()=>{dispatch(handleOpenSignupModal(true)), handleClose()}} sx={{fontSize:'14px',textTransform:'capitalize'}}>Sign Up</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Forgot Password Popup */}
      <ForgotPasswordPopup/>
    </React.Fragment>
  );
}
