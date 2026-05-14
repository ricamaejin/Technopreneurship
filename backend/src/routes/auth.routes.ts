import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  meHandler,
  signupHandler,
} from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/signup", signupHandler);
router.post("/login", loginHandler);
router.post("/logout", authenticateToken, logoutHandler);
router.get("/me", authenticateToken, meHandler);

export default router;