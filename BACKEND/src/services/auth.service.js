import {
  createUser,
  findUserByEmail,
  findUserByEmailByPassword,
  updateUser,
} from "../dao/user.dao.js";
import { ConflictError } from "../utils/errorHandler.js";
import { signToken } from "../utils/helper.js";
import {
  generateOTP,
  sendOTPEmail,
  sendWelcomeEmail,
} from "./email.service.js";

export const registerUser = async (name, email, password) => {
  const user = await findUserByEmail(email);
  if (user) throw new ConflictError("User already exists");

  // Generate OTP and set expiry (10 minutes)
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  const newUser = await createUser(name, email, password, otp, otpExpiry);

  // Send OTP email
  await sendOTPEmail(email, otp, name);

  return { message: "OTP sent to your email", email: email };
};

export const loginUser = async (email, password) => {
  const user = await findUserByEmailByPassword(email);
  if (!user) throw new Error("Invalid email or password");

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) throw new Error("Invalid email or password");
  const token = signToken({ id: user._id });
  return { token, user };
};
