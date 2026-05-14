import { Router } from "express";
import {
  createUserHandler,
  getUsersHandler,
  getUserByIdHandler,
  updateUserProfileHandler,
} from "../controllers/user.controller";
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router = Router();

// Public route - view any user profile
router.get("/profile/:id", getUserByIdHandler);

router.get("/", authenticateToken, requireAdmin, getUsersHandler);
router.post("/", authenticateToken, requireAdmin, createUserHandler);
router.get("/:id", authenticateToken, requireAdmin, getUserByIdHandler);
router.put("/profile/me", authenticateToken, updateUserProfileHandler);

export default router;
