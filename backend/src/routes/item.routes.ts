import { Router } from "express";
import {
  createItemHandler,
  getItemsHandler,
  getFeaturedItemsHandler,
  getItemByIdHandler,
  updateItemHandler,
} from "../controllers/item.controller";

const router = Router();

router.get("/", getItemsHandler);
router.get("/featured", getFeaturedItemsHandler);
router.post("/", createItemHandler);
router.get("/:id", getItemByIdHandler);
router.put("/:id", updateItemHandler);

export default router;
