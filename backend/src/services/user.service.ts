import User, { IUser } from "../models/User";

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  return User.create(userData);
};

export const getUsers = async (): Promise<IUser[]> => {
  return User.find().sort({ createdAt: -1 });
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id);
};
