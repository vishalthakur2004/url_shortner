import express from "express";
import { getAllUserUrls, getUserStats } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/urls", authMiddleware, getAllUserUrls);
router.get("/stats", authMiddleware, getUserStats);

export default router;
