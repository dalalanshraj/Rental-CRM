import express from "express";

import {
  checkOrganizationName,
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  deleteBulkOrganizations,
  addLeadToOrganization,
  removeLeadFromOrganization,
  transferOrganizationOwner,
  addOrganizationNote,
} from "../controllers/organizationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/check-name",
  protect,
  checkOrganizationName
);

router.post("/", protect, createOrganization);

router.get("/", protect, getOrganizations);

router.get("/:id", protect, getOrganizationById);

router.put("/:id", protect, updateOrganization);


// ⭐ BULK DELETE — MUST BE BEFORE /:id
router.delete(
  "/bulk-delete",
  protect,
  deleteBulkOrganizations
);


// SINGLE DELETE
router.delete(
  "/:id",
  protect,
  deleteOrganization
);


router.put(
  "/:id/add-lead",
  protect,
  addLeadToOrganization
);

router.put(
  "/:id/remove-lead",
  protect,
  removeLeadFromOrganization
);

router.put(
  "/:id/transfer",
  protect,
  transferOrganizationOwner
);

router.post(
  "/:id/notes",
  protect,
  addOrganizationNote
);

export default router;