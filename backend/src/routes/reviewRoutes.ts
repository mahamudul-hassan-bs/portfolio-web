import { Router } from "express";
import {
  getAllReviews,
  getAllReviewsAdmin,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/", getAllReviews);

// Admin routes
router.get("/admin/all", authMiddleware, getAllReviewsAdmin);
router.get("/:id", getReviewById);
router.post("/", authMiddleware, createReview);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

export default router;
