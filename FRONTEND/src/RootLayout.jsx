import React, { useEffect } from "react";
import HomePage from "./pages/HomePage";
import LoginForm from "./components/LoginForm";
import AuthPage from "./pages/AuthPage";
import { Outlet } from "@tanstack/react-router";
import Navbar from "./components/NavBar";
import { useDispatch } from "react-redux";
import { login } from "./store/slice/authSlice";
import { getCurrentUser } from "./api/user.api";

const RootLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch current user on app load to maintain login state
    const fetchCurrentUser = async () => {
      try {
        const data = await getCurrentUser();
        if (data.user) {
          dispatch(login(data.user));
        }
      } catch {
        // User is not logged in or token is invalid
        console.log("No active session");
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default RootLayout;
