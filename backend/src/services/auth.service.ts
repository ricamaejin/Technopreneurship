import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { type IUser } from "../models/User";
import type { AuthTokenPayload } from "../types/auth";

type AuthUserResponse = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
  joinDate: string;
  rating: number;
  reviewCount: number;
};

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  return secret;
};

const buildUserResponse = (user: IUser): AuthUserResponse => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  isAdmin: user.isAdmin,
  joinDate: user.joinDate,
  rating: user.rating,
  reviewCount: user.reviewCount,
});

const buildToken = (user: IUser) => {
  const payload: AuthTokenPayload = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
};

export const signup = async (userData: Partial<IUser>) => {
  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const user = await User.create(userData);
  const token = buildToken(user);

  return {
    token,
    user: buildUserResponse(user),
  };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = buildToken(user);

  return {
    token,
    user: buildUserResponse(user),
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    return null;
  }

  return buildUserResponse(user);
};