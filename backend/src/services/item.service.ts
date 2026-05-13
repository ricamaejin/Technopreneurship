import Item, { IItem } from "../models/Item";

export const createItem = async (itemData: Partial<IItem>): Promise<IItem> => {
  return Item.create(itemData);
};

export const getItems = async (): Promise<IItem[]> => {
  return Item.find().sort({ createdAt: -1 });
};

export const getFeaturedItems = async (): Promise<IItem[]> => {
  return Item.find({ isFeatured: true }).sort({ createdAt: -1 });
};

export const getItemById = async (id: string): Promise<IItem | null> => {
  return Item.findById(id);
};

export const updateItem = async (id: string, updateData: Partial<IItem>): Promise<IItem | null> => {
  return Item.findByIdAndUpdate(id, updateData, { new: true });
};
