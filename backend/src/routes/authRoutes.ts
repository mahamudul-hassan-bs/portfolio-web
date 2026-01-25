import { Router } from "express";
import { authLogin, authMe } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/login", authLogin);
router.get("/me", authMiddleware, authMe);

export default router;
