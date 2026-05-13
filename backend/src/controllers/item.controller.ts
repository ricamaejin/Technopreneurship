import type { Request, Response } from "express";
import {
  createItem,
  getItems,
  getFeaturedItems,
  getItemById,
  updateItem,
} from "../services/item.service";

export const createItemHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const itemData = req.body;
    const item = await createItem(itemData);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to create item", error });
  }
};

export const getItemsHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await getItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items", error });
  }
};

export const getFeaturedItemsHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await getFeaturedItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch featured items", error });
  }
};

export const getItemByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const itemId = Array.isArray(id) ? id[0] : id;

    if (!itemId) {
      res.status(400).json({ message: "Invalid item id" });
      return;
    }

    const item = await getItemById(itemId);
    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch item", error });
  }
};

export const updateItemHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const itemId = Array.isArray(id) ? id[0] : id;

    if (!itemId) {
      res.status(400).json({ message: "Invalid item id" });
      return;
    }

    const updateData = req.body;
    const item = await updateItem(itemId, updateData);
    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to update item", error });
  }
};
