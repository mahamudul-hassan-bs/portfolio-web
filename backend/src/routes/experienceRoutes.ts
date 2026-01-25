import { Router } from "express";
import {
  getAllExperience,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", getAllExperience);
router.get("/:id", getExperienceById);
router.post("/", authMiddleware, createExperience);
router.put("/:id", authMiddleware, updateExperience);
router.delete("/:id", authMiddleware, deleteExperience);

export default router;
