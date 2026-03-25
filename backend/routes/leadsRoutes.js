import express from "express"
import {
          createLeads,
          getLeads,
          updateLeads,
          deleteLeads

} from "../controllers/leadsController.js"

import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",protect, createLeads);
router.get("/" , protect, getLeads);
router.put("/:id", protect , updateLeads);
router.delete("/:id" , protect , deleteLeads );

export default router;



