import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const buildAuthPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  course: user.course,
  year: user.year,
  avatar: user.avatar,
  token: generateToken(user._id, user.role),
});

const buildPublicUserPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  course: user.course,
  year: user.year,
  avatar: user.avatar,
});

export const registerStudent = asyncHandler(async (req, res) => {
  const { name, email, password, course, year } = req.body;

  if (!name || !email || !password) {
    const error = new Error("Name, email, and password are required");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: "student",
    authProvider: "local",
    course,
    year,
  });

  res.status(201).json({
    success: true,
    message: "Student registered successfully",
    user: buildPublicUserPayload(user),
  });
});

const loginHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    const error = new Error("Account not found. Please sign up first.");
    error.statusCode = 404;
    throw error;
  }

  if (user.authProvider === "google" && !user.password) {
    const error = new Error("This account uses Google sign-in. Please continue with Google.");
    error.statusCode = 400;
    throw error;
  }

  if (!(await user.comparePassword(password))) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  res.json({
    success: true,
    message: "Login successful",
    user: buildAuthPayload(user),
  });
});

export const loginUser = loginHandler;
export const loginStudent = loginHandler;
export const loginAdmin = loginHandler;

export const googleSignIn = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!process.env.GOOGLE_CLIENT_ID) {
    const error = new Error("Google login is not configured on the server");
    error.statusCode = 503;
    throw error;
  }

  if (!credential) {
    const error = new Error("Google credential is required");
    error.statusCode = 400;
    throw error;
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.email || !payload?.sub) {
    const error = new Error("Could not verify Google account");
    error.statusCode = 401;
    throw error;
  }

  let user = await User.findOne({ email: payload.email.toLowerCase() });

  if (!user) {
    user = await User.create({
      name: payload.name || payload.email.split("@")[0],
      email: payload.email.toLowerCase(),
      role: "student",
      googleId: payload.sub,
      authProvider: "google",
      avatar: payload.picture || "",
    });
  } else {
    user.googleId = payload.sub;
    user.authProvider = user.authProvider || "google";
    user.avatar = payload.picture || user.avatar;
    await user.save();
  }

  res.json({
    success: true,
    message: "Google login successful",
    user: buildAuthPayload(user),
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});
