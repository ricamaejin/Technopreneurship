import type { Request, Response } from "express";
import { getCurrentUser, login, signup } from "../services/auth.service";

export const signupHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, avatar, isAdmin, joinDate, rating, reviewCount } = req.body;

    if (!name || !email || !password || !joinDate) {
      res.status(400).json({ message: "name, email, password, and joinDate are required" });
      return;
    }

    const result = await signup({
      name,
      email,
      password,
      avatar,
      isAdmin,
      joinDate,
      rating,
      reviewCount,
    });

    res.status(201).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to sign up";
    res.status(400).json({ message });
  }
};

export const loginHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "email and password are required" });
      return;
    }

    const result = await login(email, password);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to log in";
    res.status(401).json({ message });
  }
};

export const meHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await getCurrentUser(req.user.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch current user";
    res.status(500).json({ message });
  }
};

export const logoutHandler = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "Logged out successfully" });
};