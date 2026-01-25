import { Router } from "express";
import {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", getAllSkills);
router.get("/:id", getSkillById);
router.post("/", authMiddleware, createSkill);
router.put("/:id", authMiddleware, updateSkill);
router.delete("/:id", authMiddleware, deleteSkill);

export default router;
