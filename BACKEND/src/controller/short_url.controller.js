import { getShortUrl } from "../dao/short_url.js";
import {
  createShortUrlWithoutUser,
  createShortUrlWithUser,
} from "../services/short_url.service.js";
import wrapAsync from "../utils/tryCatchWrapper.js";

export const createShortUrl = wrapAsync(async (req, res) => {
  const data = req.body;
  const ipAddress =
    req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  let shortUrl;
  if (req.user) {
    shortUrl = await createShortUrlWithUser(data.url, req.user._id, data.slug);
  } else {
    shortUrl = await createShortUrlWithoutUser(data.url, ipAddress);
  }
  res.status(200).json({ shortUrl: process.env.APP_URL + shortUrl });
});

export const redirectFromShortUrl = wrapAsync(async (req, res) => {
  const { id } = req.params;
  try {
    const url = await getShortUrl(id);
    if (!url) throw new Error("Short URL not found");
    res.redirect(url.full_url);
  } catch (error) {
    // If it's a click limit error, return a user-friendly HTML page
    if (error.message.includes("maximum") && error.message.includes("clicks")) {
      return res.status(403).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Click Limit Reached</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f9fafb; }
                        .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                        .icon { font-size: 64px; margin-bottom: 20px; }
                        h1 { color: #ef4444; margin-bottom: 20px; }
                        p { color: #6b7280; line-height: 1.6; }
                        .button { display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="icon">🔒</div>
                        <h1>Click Limit Reached</h1>
                        <p>${error.message}</p>
                        <p>This short URL was created by a free user and has reached its maximum number of allowed clicks.</p>
                        <a href="http://localhost:5173" class="button">Create Your Own Short URLs</a>
                    </div>
                </body>
                </html>
            `);
    }
    throw error;
  }
});

export const createCustomShortUrl = wrapAsync(async (req, res) => {
  const { url, slug } = req.body;
  const shortUrl = await createShortUrlWithoutUser(url, customUrl);
  res.status(200).json({ shortUrl: process.env.APP_URL + shortUrl });
});
