import { Router } from "express";
import {
  createNotificationHandler,
  getNotificationsHandler,
  getUnreadCountHandler,
  markAsReadHandler,
  markAllAsReadHandler,
  deleteNotificationHandler,
} from "../controllers/notification.controller";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.post("/", createNotificationHandler); // For internal system use
router.get("/", getNotificationsHandler);
router.get("/unread-count", getUnreadCountHandler);
router.patch("/:id/read", markAsReadHandler);
router.post("/mark-all-read", markAllAsReadHandler);
router.delete("/:id", deleteNotificationHandler);

export default router;
