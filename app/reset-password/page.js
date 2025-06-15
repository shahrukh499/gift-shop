"use client";
import { Button, TextField } from "@mui/material";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { API_CONFIG, getApiUrl } from "../utils/apiConfig";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({});

  const handleFetchConfirmForgotPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setMessage({ message: "Passwords doesn't match", type: "error" });
    }
    const payload = {
      token,
      newPassword,
    };
    try {
      const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.FORGOTPASSWORDCONFIRM);
      const requestOptions = API_CONFIG.createRequestOptions(
        API_CONFIG.HTTP_METHODS.POST,
        payload
      );
      const response = await fetch(apiUri, requestOptions);
      const data = await response.json();
      if (data.status === API_CONFIG.STATUS_CODES.SUCCESS) {
        setMessage({ message: data.message, type: "success" });
        setTimeout(() => {
          window.close();
        }, 3000);
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <div className="max-w-full w-[500px] mx-auto p-5 rounded-lg">
      <div className="mb-3 lg:mb-6">
        <h1 className="text-[20px] lg:text-[45px] font-[600] leading-tight">
          Reset
          <br /> Your <span className="text-purple-500">Password</span>
        </h1>
      </div>
      <form onSubmit={handleFetchConfirmForgotPassword}>
        <div className="flex flex-wrap gap-y-2 lg:gap-y-6">
          <div className="w-full">
            <TextField
              id="standard-basic"
              label="Password"
              variant="standard"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              required
            />
          </div>
          <div className="w-full">
            <TextField
              id="standard-basic"
              label="Confirm Password"
              variant="standard"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
            />
            <div>
              <small className={`${message.type == 'error' ? 'text-red-500' : 'text-green-500'}`}>{message.message}</small>
            </div>
          </div>
          <div className="w-full mt-6">
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                width: "100%",
                fontFamily: "poppins",
                backgroundColor: "#531fd9",
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <section className="py-6 lg:py-0 h-screen overflow-hidden">
      <div className="px-2 md:px-0">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-[45%] order-2 lg:order-1 flex justify-center flex-col">
            <Suspense fallback={<div>Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
          <div className="w-full lg:w-[55%] order-1 lg:order-2">
            <Image
              src="/assets/img/cedss.webp"
              alt=""
              width={1400}
              height={1200}
            />
          </div>
        </div>
      </div>
      {/* ...existing commented code... */}
    </section>
  );
}
