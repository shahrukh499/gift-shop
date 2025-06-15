"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import { Badge, Skeleton, Tooltip } from "@mui/material";
import Link from "next/link";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import AccountMenu from "./AccountMenu";
import Login from "./LoginPopup";
import { useDispatch, useSelector } from "react-redux";
import { setAuthLoading, setUser } from "./authSile";
import SignupPopup from "./SignupPupup";
import { usePathname, useRouter } from "next/navigation";
import { handleGetCartItems } from "@/app/cart/cartSlice";
import { hideHeaderFooter } from "@/app/lib/utils";
import SearchProducts from "./SearchProducts";
import NavItems from "./NavItems";

export default function Header() {
  /* const [user, setUser] = React.useState() */
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.authSlice);
  const { cart } = useSelector((state) => state.cartSlice);
  const pathname = usePathname();
  const router = useRouter();
  const shouldHide = hideHeaderFooter.includes(pathname);

  React.useEffect(() => {
    dispatch(handleGetCartItems());
  }, [dispatch]);

  React.useEffect(() => {
    const userLog = localStorage.getItem("logData");
    if (userLog) {
      dispatch(setUser(JSON.parse(userLog)));
    } else {
      dispatch(setAuthLoading(false)); // Set loading to false if no user found
    }
  }, [dispatch]);

  const logout = () => {
    localStorage.removeItem("logData");
    dispatch(setUser(null));
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#FDFAF6",
        color: "black",
        boxShadow: "none",
        display: shouldHide ? "none" : "",
      }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display:{md:'none'} }}
        >
          <MenuIcon />
        </IconButton>
        <Box variant="div" component="div" sx={{ flexGrow: 0 }}>
          <Link href="/">
            <Image src="/assets/img/logo.svg" alt="" width={130} height={80} />
          </Link>
        </Box>
        <Box component="div" sx={{ flexGrow: 1 }} className="relative ms-16">
          <NavItems />
        </Box>
        <Box
          variant="div"
          component="div"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <SearchProducts />
          <Tooltip title="Cart">
            <IconButton
              color="inherit"
              onClick={() => router.push("/cart")}
              sx={{ padding: "10px" }}
            >
              <Badge
                badgeContent={cart?.cart?.items?.length || 0}
                color="secondary"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#e17319", // Override color
                    color: "white",
                  },
                }}
              >
                <LocalMallOutlinedIcon sx={{ color: "#222222" }} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Wishlist">
            <IconButton color="inherit" onClick={() => router.push("/about")}>
              <FavoriteBorderIcon sx={{ color: "#222222" }} />
            </IconButton>
          </Tooltip>
          {loading ? (
            <Skeleton
              variant="circular"
              animation="wave"
              width={30}
              height={30}
            />
          ) : user?.isLoggedIn ? (
            <AccountMenu logout={logout} />
          ) : (
            <>
              <Login />
              <SignupPopup />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
