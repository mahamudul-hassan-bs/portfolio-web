import { Router } from "express";
import {
  getAllBlogs,
  getAllBlogsAdmin,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/admin/all", authMiddleware, getAllBlogsAdmin);
router.get("/admin/:id", authMiddleware, getBlogById);
router.get("/", getAllBlogs);
router.get("/:slug", getBlogBySlug);
router.post("/", authMiddleware, createBlog);
router.put("/:id", authMiddleware, updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);

export default router;
