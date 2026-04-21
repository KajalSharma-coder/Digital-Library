import Book from "../models/Book.js";
import Transaction from "../models/Transaction.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const requestBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.bookId);

  if (!book) {
    const error = new Error("Book not found");
    error.statusCode = 404;
    throw error;
  }

  if (book.availableCopies <= 0) {
    const error = new Error("No copies available right now");
    error.statusCode = 400;
    throw error;
  }

  const existingRequest = await Transaction.findOne({
    user: req.user._id,
    book: book._id,
    status: { $in: ["pending", "approved"] },
  });

  if (existingRequest) {
    const error = new Error("You already have an active request for this book");
    error.statusCode = 409;
    throw error;
  }

  const transaction = await Transaction.create({
    user: req.user._id,
    book: book._id,
  });

  res.status(201).json({
    success: true,
    message: "Book request submitted",
    transaction,
  });
});

export const getMyHistory = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id })
    .populate("book")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    transactions,
  });
});

export const getAllTransactions = asyncHandler(async (_req, res) => {
  const transactions = await Transaction.find()
    .populate("book")
    .populate("user", "name email course year role")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    transactions,
  });
});

export const approveRequest = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id).populate("book");

  if (!transaction) {
    const error = new Error("Transaction not found");
    error.statusCode = 404;
    throw error;
  }

  if (transaction.book.availableCopies <= 0) {
    const error = new Error("No copies available to approve");
    error.statusCode = 400;
    throw error;
  }

  if (transaction.status !== "pending") {
    const error = new Error("Only pending requests can be approved");
    error.statusCode = 400;
    throw error;
  }

  transaction.status = "approved";
  transaction.approvedAt = new Date();
  await transaction.save();

  transaction.book.availableCopies -= 1;
  await transaction.book.save();

  res.json({
    success: true,
    message: "Request approved successfully",
  });
});

export const rejectRequest = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    const error = new Error("Transaction not found");
    error.statusCode = 404;
    throw error;
  }

  if (transaction.status !== "pending") {
    const error = new Error("Only pending requests can be rejected");
    error.statusCode = 400;
    throw error;
  }

  transaction.status = "rejected";
  await transaction.save();

  res.json({
    success: true,
    message: "Request rejected successfully",
  });
});

export const returnBook = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id).populate("book");

  if (!transaction) {
    const error = new Error("Transaction not found");
    error.statusCode = 404;
    throw error;
  }

  if (transaction.status !== "approved") {
    const error = new Error("Only approved books can be marked as returned");
    error.statusCode = 400;
    throw error;
  }

  transaction.status = "returned";
  transaction.returnedAt = new Date();
  await transaction.save();

  transaction.book.availableCopies += 1;
  await transaction.book.save();

  res.json({
    success: true,
    message: "Book marked as returned",
  });
});
