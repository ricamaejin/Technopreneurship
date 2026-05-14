import type { Request, Response } from "express";
import { createUser, getUsers, getUserById, updateUserProfile } from "../services/user.service";

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

export const updateUserProfileHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { name, avatar } = req.body;

    if (!name && !avatar) {
      res.status(400).json({ message: "Provide at least one field to update (name or avatar)" });
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    const updatedUser = await updateUserProfile(userId, updateData as Partial<any>);

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error });
  }
};
