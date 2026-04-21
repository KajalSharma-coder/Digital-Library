import asyncHandler from "../middleware/asyncHandler.js";

export const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    const error = new Error("Name, email, and message are required");
    error.statusCode = 400;
    throw error;
  }

  res.status(201).json({
    success: true,
    message: "Message received successfully",
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      submittedAt: new Date().toISOString(),
    },
  });
});
