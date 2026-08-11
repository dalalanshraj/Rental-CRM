 import express from "express";

import {
  register,
  login,
  getUsers,
  getMyProfile,
  updateMyProfile,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// REGISTER
router.post("/register", register);


// LOGIN
router.post("/login", login);


// GET USERS
router.get("/", protect, getUsers);


// ==========================================
// MY PROFILE
// ==========================================

router.get(
  "/me",
  protect,
  getMyProfile
);

router.put(
  "/me",
  protect,
  updateMyProfile
);


export default router;