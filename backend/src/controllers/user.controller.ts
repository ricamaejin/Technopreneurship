import type { Request, Response } from "express";
import { createUser, getUsers, getUserById } from "../services/user.service";

export const createUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = req.body;
    const user = await createUser(userData);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to create user", error });
  }
};

export const getUsersHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

export const getUserByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const user = await getUserById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error });
  }
};
