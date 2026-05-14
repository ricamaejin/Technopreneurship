import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  createReviewHandler,
  getReviewsByItemIdHandler,
  getReviewsByOwnerIdHandler,
} from "../controllers/review.controller";

const router = Router();

router.get("/item/:itemId", getReviewsByItemIdHandler);
router.get("/owner/:ownerId", getReviewsByOwnerIdHandler);
router.post("/", authenticateToken, createReviewHandler);

export default router;