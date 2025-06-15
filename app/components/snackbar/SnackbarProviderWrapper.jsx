"use client";

import { SnackbarProvider } from "notistack";

export default function SnackbarProviderWrapper({ children }) {
  return (
    <SnackbarProvider
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      maxSnack={3}
    >
      {children}
    </SnackbarProvider>
  );
}
