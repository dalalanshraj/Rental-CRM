import express from "express";
import {
  createLeads,
  getLeads,
  updateLeads,
  deleteLeads,
  getLeadById,
  // addNote,
  // deleteNote,
  // updateNote,
  // pinNote,
   linkOrganization,
   transferLeadOwner,
} from "../controllers/leadsController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createLeads);
router.get("/", protect, getLeads);
router.put("/:id", protect, updateLeads);
router.get("/:id", protect, getLeadById);
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
router.put("/:id/transfer", protect, transferLeadOwner);


export default router;
