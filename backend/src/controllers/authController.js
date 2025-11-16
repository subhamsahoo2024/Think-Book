import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const SALT_ROUNDS = 10;

export async function register(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ email, password: hashed, name });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY || "7d",
      }
    );

    const safeUser = { _id: user._id, email: user.email, name: user.name };
    res.status(201).json({ user: safeUser, token });
  } catch (error) {
    console.error("Error in register", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY || "7d",
      }
    );

    const safeUser = { _id: user._id, email: user.email, name: user.name };
    res.status(200).json({ user: safeUser, token });
  } catch (error) {
    console.error("Error in login", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export function logout(_, res) {
  // Stateless JWTs can't be invalidated server-side without a store.
  // Provide a simple response for client to clear token.
  res.status(200).json({ message: "Logged out" });
}
