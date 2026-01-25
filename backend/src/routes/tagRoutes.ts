import { Router } from "express";
import { getAllTags, createTag, deleteTag } from "../controllers/tagController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", getAllTags);
router.post("/", authMiddleware, createTag);
router.delete("/:name", authMiddleware, deleteTag);

export default router;
