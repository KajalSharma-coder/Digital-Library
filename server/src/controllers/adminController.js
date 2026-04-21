import Book from "../models/Book.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getAdminStats = asyncHandler(async (_req, res) => {
  const [totalBooks, totalUsers, issuedBooks, pendingRequests, recentTransactions] = await Promise.all([
    Book.countDocuments(),
    User.countDocuments({ role: "student" }),
    Transaction.countDocuments({ status: "approved" }),
    Transaction.countDocuments({ status: "pending" }),
    Transaction.find()
      .populate("book", "title")
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(6),
  ]);

  res.json({
    success: true,
    stats: {
      totalBooks,
      totalUsers,
      issuedBooks,
      pendingRequests,
      recentTransactions,
    },
  });
});

export const getStudents = asyncHandler(async (_req, res) => {
  const students = await User.find({ role: "student" }).select("-password").sort({ createdAt: -1 });
  res.json({ success: true, students });
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await User.findOne({ _id: req.params.id, role: "student" });

  if (!student) {
    const error = new Error("Student not found");
    error.statusCode = 404;
    throw error;
  }

  const activeIssues = await Transaction.countDocuments({
    user: student._id,
    status: "approved",
  });

  if (activeIssues > 0) {
    const error = new Error("Student has active issued books and cannot be deleted");
    error.statusCode = 400;
    throw error;
  }

  await student.deleteOne();
  await Transaction.deleteMany({ user: student._id });

  res.json({
    success: true,
    message: "Student deleted successfully",
  });
});
