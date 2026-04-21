import express from "express";
import {
  approveRequest,
  getAllTransactions,
  getMyHistory,
  rejectRequest,
  requestBook,
  returnBook,
} from "../controllers/transactionController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request/:bookId", protect, authorize("student"), requestBook);
router.get("/my-history", protect, authorize("student"), getMyHistory);
router.get("/", protect, authorize("admin"), getAllTransactions);
router.patch("/:id/approve", protect, authorize("admin"), approveRequest);
router.patch("/:id/reject", protect, authorize("admin"), rejectRequest);
router.patch("/:id/return", protect, authorize("admin"), returnBook);

export default router;

