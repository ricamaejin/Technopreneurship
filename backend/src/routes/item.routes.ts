import { Router } from "express";
import {
  createItemHandler,
  getItemsHandler,
  getFeaturedItemsHandler,
  getItemByIdHandler,
  getItemsByOwnerIdHandler,
  updateItemHandler,
  deleteItemHandler,
} from "../controllers/item.controller";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/", getItemsHandler);
router.get("/featured", getFeaturedItemsHandler);
router.get("/owner/me", authenticateToken, getItemsByOwnerIdHandler);
router.get("/owner/:ownerId", getItemsByOwnerIdHandler); // Public route
router.post("/", authenticateToken, createItemHandler);
router.get("/:id", getItemByIdHandler);
router.put("/:id", authenticateToken, updateItemHandler);
router.delete("/:id", authenticateToken, deleteItemHandler);

export default router;
