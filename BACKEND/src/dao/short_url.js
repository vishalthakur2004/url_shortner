import urlSchema from "../models/short_url.model.js";
import { ConflictError } from "../utils/errorHandler.js";

export const saveShortUrl = async (
  shortUrl,
  longUrl,
  userId,
  ipAddress = null,
) => {
  try {
    const newUrl = new urlSchema({
      full_url: longUrl,
      short_url: shortUrl,
    });
    if (userId) {
      newUrl.user = userId;
    }
    if (ipAddress && !userId) {
      newUrl.ip_address = ipAddress;
      newUrl.click_limit = 10; // Free users have 10 click limit per URL
    }
    await newUrl.save();
  } catch (err) {
    if (err.code == 11000) {
      throw new ConflictError("Short URL already exists");
    }
    throw new Error(err);
  }
};

export const getShortUrl = async (shortUrl) => {
  const url = await urlSchema.findOne({ short_url: shortUrl });

  if (!url) {
    return null;
  }

  // Check if URL has click limit and if it's reached
  if (url.click_limit !== null && url.clicks >= url.click_limit) {
    throw new Error(
      `This short URL has reached its maximum of ${url.click_limit} clicks. Please contact the creator for assistance.`,
    );
  }

  // Increment clicks and return updated URL
  return await urlSchema.findOneAndUpdate(
    { short_url: shortUrl },
    { $inc: { clicks: 1 } },
    { new: true },
  );
};

export const getCustomShortUrl = async (slug) => {
  return await urlSchema.findOne({ short_url: slug });
};

export const getUrlCountByIpAddress = async (ipAddress) => {
  return await urlSchema.countDocuments({ ip_address: ipAddress });
};
