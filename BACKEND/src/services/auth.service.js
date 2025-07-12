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

  if (!user.emailVerified)
    throw new Error("Please verify your email before logging in");

  const token = signToken({ id: user._id });
  return { token, user };
};

export const verifyUserOTP = async (email, otp) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("User not found");

  if (user.emailVerified) throw new Error("Email already verified");

  if (!user.verificationOTP || user.verificationOTP !== otp) {
    throw new Error("Invalid OTP");
  }

  if (new Date() > user.otpExpiry) {
    throw new Error("OTP has expired");
  }

  // Mark email as verified and clear OTP data
  const updatedUser = await updateUser(user._id, {
    emailVerified: true,
    verificationOTP: undefined,
    otpExpiry: undefined,
  });

  // Send welcome email
  await sendWelcomeEmail(email, user.name);

  const token = signToken({ id: user._id });
  return { token, user: updatedUser };
};

export const resendOTP = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("User not found");

  if (user.emailVerified) throw new Error("Email already verified");

  // Generate new OTP and extend expiry
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  await updateUser(user._id, {
    verificationOTP: otp,
    otpExpiry: otpExpiry,
  });

  // Send OTP email
  await sendOTPEmail(email, otp, user.name);

  return { message: "OTP sent successfully" };
};
