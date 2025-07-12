import User from "../models/user.model.js";
import UrlModel from "../models/short_url.model.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({ email }).select("+verificationOTP +otpExpiry");
};

export const findUserByEmailByPassword = async (email) => {
  return await User.findOne({ email }).select("+password");
};

export const findUserById = async (id) => {
  return await User.findById(id);
};

export const createUser = async (
  name,
  email,
  password,
  verificationOTP = null,
  otpExpiry = null,
) => {
  const newUser = new User({
    name,
    email,
    password,
    verificationOTP,
    otpExpiry,
    emailVerified: false,
  });
  await newUser.save();
  return newUser;
};

export const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

export const getAllUserUrlsDao = async (id) => {
  return await UrlModel.find({ user: id });
};

export const getUserStatsDao = async (id) => {
  const urls = await UrlModel.find({ user: id });
  const totalUrls = urls.length;
  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
  const averageClicks =
    totalUrls > 0 ? (totalClicks / totalUrls).toFixed(1) : 0;

  // Find top performing URL
  const topUrl =
    urls.length > 0
      ? urls.reduce((prev, current) =>
          prev.clicks > current.clicks ? prev : current,
        )
      : null;

  return {
    totalUrls,
    totalClicks,
    averageClicks,
    topUrl,
  };
};
