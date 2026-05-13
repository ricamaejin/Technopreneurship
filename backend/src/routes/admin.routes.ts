import { Router } from "express";
import {
  getUsers,
  getListings,
  getBorrowRequests,
  getOverdueItems,
  getDisputes,
  getCategoryStatsController,
  getBorrowVolumeDataController,
  getTopLendersController,
  getStats,
} from "../controllers/admin.controller";

const router = Router();

router.get("/users", getUsers);
router.get("/listings", getListings);
router.get("/borrow-requests", getBorrowRequests);
router.get("/overdue-items", getOverdueItems);
router.get("/disputes", getDisputes);
router.get("/category-stats", getCategoryStatsController);
router.get("/borrow-volume", getBorrowVolumeDataController);
router.get("/top-lenders", getTopLendersController);
router.get("/stats", getStats);

export default router;
