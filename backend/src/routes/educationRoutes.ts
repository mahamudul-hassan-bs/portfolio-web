import { Router } from "express";
import {
  getAllEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../controllers/educationController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", getAllEducation);
router.get("/:id", getEducationById);
router.post("/", authMiddleware, createEducation);
router.put("/:id", authMiddleware, updateEducation);
router.delete("/:id", authMiddleware, deleteEducation);

export default router;
