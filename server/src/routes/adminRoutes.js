import express from "express";
import { deleteStudent, getAdminStats, getStudents } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/stats", getAdminStats);
router.get("/users", getStudents);
router.delete("/users/:id", deleteStudent);

export default router;
