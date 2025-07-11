import { generateNanoId } from "../utils/helper.js";
import urlSchema from "../models/short_url.model.js";
import {
  getCustomShortUrl,
  saveShortUrl,
  getUrlCountByIpAddress,
  getUrlCountByUser,
} from "../dao/short_url.js";

export const createShortUrlWithoutUser = async (url, ipAddress) => {
  // Check if IP address has reached the 5 URL limit
  const urlCount = await getUrlCountByIpAddress(ipAddress);
  if (urlCount >= 5) {
    throw new Error(
      "Free users are limited to 5 short URLs. Please sign up for unlimited access.",
    );
  }

  const shortUrl = generateNanoId(7);
  if (!shortUrl) throw new Error("Short URL not generated");
  await saveShortUrl(shortUrl, url, null, ipAddress);
  return shortUrl;
};

export const createShortUrlWithUser = async (url, userId, slug = null) => {
  const shortUrl = slug || generateNanoId(7);
  if (slug) {
    const exists = await getCustomShortUrl(slug);
    if (exists) throw new Error("This custom url already exists");
  }

  await saveShortUrl(shortUrl, url, userId);
  return shortUrl;
};
