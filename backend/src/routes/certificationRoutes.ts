import { Router } from "express";
import {
  getAllCertifications,
  getAllCertificationsAdmin,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification,
} from "../controllers/certificationController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/", getAllCertifications);

// Admin routes (protected)
router.get("/admin/all", authMiddleware, getAllCertificationsAdmin);
router.get("/admin/:id", authMiddleware, getCertificationById);
router.post("/", authMiddleware, createCertification);
router.put("/:id", authMiddleware, updateCertification);
router.delete("/:id", authMiddleware, deleteCertification);

export default router;
