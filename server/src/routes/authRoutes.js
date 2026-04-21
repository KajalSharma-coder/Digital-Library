import express from "express";
import { getCurrentUser, googleSignIn, loginAdmin, loginStudent, loginUser, registerStudent } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginUser);
router.post("/login/student", loginStudent);
router.post("/login/admin", loginAdmin);
router.post("/google", googleSignIn);
router.get("/me", protect, getCurrentUser);

export default router;
