import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import short_url from "./routes/short_url.route.js";
import user_routes from "./routes/user.routes.js";
import auth_routes from "./routes/auth.routes.js";
import { redirectFromShortUrl } from "./controller/short_url.controller.js";
import { errorHandler } from "./utils/errorHandler.js";
import { attachUser } from "./utils/attachUser.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Frontend URLs
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

app.use(attachUser);

app.use("/api/user", user_routes);
app.use("/api/auth", auth_routes);
app.use("/api/create", short_url);
app.get("/:id", redirectFromShortUrl);

app.use(errorHandler);

export { app };