import express from "express";
import { createBook, deleteBook, getBookCategories, getBooks, getWorkspaceStats, updateBook } from "../controllers/bookController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/workspace", getWorkspaceStats);
router.use(protect);
router.get("/", getBooks);
router.get("/categories", getBookCategories);
router.post("/", authorize("admin"), createBook);
router.put("/:id", authorize("admin"), updateBook);
router.delete("/:id", authorize("admin"), deleteBook);

export default router;
