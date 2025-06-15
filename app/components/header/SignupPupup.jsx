"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import {
  Alert,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Snackbar,
  TextField,
  Tooltip,
} from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { API_CONFIG, getApiUrl } from "@/app/utils/apiConfig";
import { useDispatch, useSelector } from "react-redux";
import { setLocalStorageData, setUser } from "./authSile";
import { handleOpenSignupModal } from "./popupSlice";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SignupPopup() {
  const [open, setOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [alert, setAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  let ref = React.useRef();
  const dispatch = useDispatch();
  const {isSignupOpen} = useSelector((state)=> state.popupSlice)

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };


  const handleClose = () => {
    dispatch(handleOpenSignupModal(false))
  };

  const handleAlert = () => {
    setAlert(true);
  };
  const closeAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert(false);
  };

  //login api fetching
  const handleFetchSignup = async (e) => {
    e.preventDefault();
    const payload = {
      name: name,
      email: email,
      password: password,
    };
    try {
      const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.SIGNUP);
      const requestOptions = API_CONFIG.createRequestOptions(
        API_CONFIG.HTTP_METHODS.POST,
        payload
      );
      const response = await fetch(apiUri, requestOptions);
      const data = await response.json();
      console.log(data, "data");

      if (data.status === API_CONFIG.STATUS_CODES.SUCCESS) {
        const loginData = {
          isLoggedIn: true,
          token: data.token,
          username: data.username,
        };
        /*  console.log(loginData,'ggg'); */
        dispatch(setLocalStorageData(loginData));
        dispatch(setUser(loginData));
        setAlertMessage(data.message);
        handleAlert();
        handleClose();
      } else {
        setAlertMessage(data.message);
        handleAlert();
      }
    } catch (error) {
      console.log(error);
      setAlertMessage(error.message);
      handleAlert();
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={isSignupOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <div>
            <form
              ref={ref}
              onSubmit={(e) => {
                handleFetchSignup(e);
                ref.current.reset();
              }}
            >
              <TextField
                type="text"
                id="standard-basic"
                label="Name"
                variant="standard"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
              <FormControl sx={{ width: "100%" }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">
                  Password
                </InputLabel>
                <Input
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
              </FormControl>
              <Button type="submit" variant="contained" color="primary">
                Login
              </Button>
            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose}>Agree</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={alert}
        autoHideDuration={6000}
        onClose={closeAlert}
      >
        <Alert
          onClose={closeAlert}
          severity={alertMessage.includes("success") ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
