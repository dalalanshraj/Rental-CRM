import express from "express"
import {
    createDeals,
    getDeals,
    updateDeals,
    deleteDeal,
} from "../controllers/dealsController.js"

import {protect} from  "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/", protect, createDeals);
router.get("/", protect, getDeals);
router.put("/:id", protect, updateDeals);
router.delete("/:id", protect, deleteDeal);

export default router;