import express from "express";

import { exportData } from "../controllers/exportController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ADMIN ONLY EXPORT
router.get(
  "/",
  protect,
  adminOnly,
  exportData
);

export default router;