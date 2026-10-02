import express from "express";

import {
  checkLeadName,
  createLeads,
  getLeads,
  updateLeads,
  getLeadById,
  deleteLeads,
  deleteBulkLeads,
  // addNote,
  // deleteNote,
  // updateNote,
  // pinNote,handleChange
  linkOrganization,
  transferLeadOwner,
} from "../controllers/leadsController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/check-name", protect, checkLeadName);
router.post("/", protect, createLeads);

router.get("/", protect, getLeads);

router.put("/:id", protect, updateLeads);

router.get("/:id", protect, getLeadById);


// ⭐ IMPORTANT: bulk route MUST come before /:id
router.delete("/bulk-delete", protect, deleteBulkLeads);


// Single lead delete
router.delete("/:id", protect, deleteLeads);


// router.post("/:id/notes", protect, addNote);
// router.delete("/:id/notes/:noteId", protect, deleteNote);
// router.put("/:id/notes/:noteId", protect, updateNote);
// router.patch("/:id/notes/:noteId/pin", protect, pinNote);


router.put(
  "/:id/link-organization",
  protect,
  linkOrganization
);

router.put(
  "/:id/transfer",
  protect,
  transferLeadOwner
);

export default router;