import Book from "../models/Book.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getWorkspaceStats = asyncHandler(async (_req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const [availableBooksAgg, registeredStudents, pendingApprovals, returnsToday] = await Promise.all([
    Book.aggregate([{ $group: { _id: null, total: { $sum: "$availableCopies" } } }]),
    User.countDocuments({ role: "student" }),
    Transaction.countDocuments({ status: "pending" }),
    Transaction.countDocuments({
      status: "returned",
      returnedAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }),
  ]);

  res.json({
    success: true,
    stats: {
      availableBooks: availableBooksAgg[0]?.total || 0,
      registeredStudents,
      pendingApprovals,
      returnsToday,
    },
  });
});

export const getBooks = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 8;
  const search = req.query.search || "";
  const category = req.query.category || "";

  const query = {
    ...(search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } },
            { isbn: { $regex: search, $options: "i" } },
          ],
        }
      : {}),
    ...(category ? { category: { $regex: `^${category}$`, $options: "i" } } : {}),
  };

  const [books, total] = await Promise.all([
    Book.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Book.countDocuments(query),
  ]);

  res.json({
    success: true,
    books,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getBookCategories = asyncHandler(async (_req, res) => {
  const categories = await Book.distinct("category");
  res.json({ success: true, categories });
});

export const createBook = asyncHandler(async (req, res) => {
  const { title, author, category, isbn, description, coverImage, publishedYear, quantity } = req.body;

  const book = await Book.create({
    title,
    author,
    category,
    isbn,
    description,
    coverImage,
    publishedYear,
    quantity,
    availableCopies: quantity,
  });

  res.status(201).json({
    success: true,
    message: "Book added successfully",
    book,
  });
});

export const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    const error = new Error("Book not found");
    error.statusCode = 404;
    throw error;
  }

  const approvedIssuedCount = await Transaction.countDocuments({
    book: book._id,
    status: "approved",
  });

  Object.assign(book, req.body);

  if (typeof req.body.quantity === "number") {
    book.availableCopies = Math.max(req.body.quantity - approvedIssuedCount, 0);
  }

  await book.save();

  res.json({
    success: true,
    message: "Book updated successfully",
    book,
  });
});

export const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    const error = new Error("Book not found");
    error.statusCode = 404;
    throw error;
  }

  await book.deleteOne();

  res.json({
    success: true,
    message: "Book deleted successfully",
  });
});
