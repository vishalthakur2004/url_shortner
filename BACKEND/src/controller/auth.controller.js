import { cookieOptions } from "../config/config.js";
import {
  loginUser,
  registerUser,
  verifyUserOTP,
  resendOTP,
} from "../services/auth.service.js";
import wrapAsync from "../utils/tryCatchWrapper.js";

export const register_user = wrapAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await registerUser(name, email, password);
  res.status(200).json(result);
});

export const login_user = wrapAsync(async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await loginUser(email, password);
  req.user = user;
  res.cookie("accessToken", token, cookieOptions);
  res.status(200).json({ user: user, message: "login success" });
});

export const logout_user = wrapAsync(async (req, res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.status(200).json({ message: "logout success" });
});

export const get_current_user = wrapAsync(async (req, res) => {
  res.status(200).json({ user: req.user });
});

export const verify_otp = wrapAsync(async (req, res) => {
  const { email, otp } = req.body;
  const { token, user } = await verifyUserOTP(email, otp);
  req.user = user;
  res.cookie("accessToken", token, cookieOptions);
  res.status(200).json({ user: user, message: "Email verified successfully" });
});

export const resend_otp = wrapAsync(async (req, res) => {
  const { email } = req.body;
  await resendOTP(email);
  res.status(200).json({ message: "OTP sent successfully" });
});
