import axiosInstance from "../utils/axiosInstance";

export const loginUser = async (password, email) => {
  const { data } = await axiosInstance.post("/api/auth/login", {
    email,
    password,
  });
  return data;
};

export const registerUser = async (name, password, email) => {
  const { data } = await axiosInstance.post("/api/auth/register", {
    name,
    email,
    password,
  });
  return data;
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.post("/api/auth/logout");
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get("/api/auth/me");
  return data;
};

export const getAllUserUrls = async () => {
  const { data } = await axiosInstance.post("/api/user/urls");
  return data;
};

export const getUserStats = async () => {
  const { data } = await axiosInstance.get("/api/user/stats");
  return data;
};

export const verifyOTP = async (email, otp) => {
  const { data } = await axiosInstance.post("/api/auth/verify-otp", {
    email,
    otp,
  });
  return data;
};

export const resendOTP = async (email) => {
  const { data } = await axiosInstance.post("/api/auth/resend-otp", {
    email,
  });
  return data;
};
