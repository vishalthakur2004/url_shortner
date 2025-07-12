import express from "express";
import {
  register_user,
  login_user,
  logout_user,
  get_current_user,
  verify_otp,
  resend_otp,
} from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register_user);
router.post("/login", login_user);
router.post("/logout", logout_user);
router.post("/verify-otp", verify_otp);
router.post("/resend-otp", resend_otp);
router.get("/me", authMiddleware, get_current_user);

export default router;
