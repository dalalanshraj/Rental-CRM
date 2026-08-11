import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  createActivity,
  getActivities,
  updateActivity,
  deleteActivity,
  completeActivity,
} from "../controllers/activityController.js";

const router = express.Router();

// Create Activity
router.post("/", protect, createActivity);

// Get Activities
// Example:
// /api/activities?leadId=xxxxx
// /api/activities?organizationId=xxxxx
router.get("/", protect, getActivities);

// Update Activity
router.put("/:id", protect, updateActivity);

// Delete Activity
router.delete("/:id", protect, deleteActivity);

// Complete / Uncomplete Activity
router.patch("/:id/complete", protect, completeActivity);

export default router;