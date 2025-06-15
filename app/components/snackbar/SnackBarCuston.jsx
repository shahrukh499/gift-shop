"use client"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { hideSnackbar } from "./snackbarSlice";


export default function SnackBarCuston() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { open, message, variant } = useSelector((state) => state.snackbarSlice);

  useEffect(() => {
    if (open) {
      enqueueSnackbar(message, { variant });
      dispatch(hideSnackbar()); // Hide after displaying
    }
  }, [open, message, variant, enqueueSnackbar, dispatch]);

  return null; // No UI needed, just listens for state updates
}