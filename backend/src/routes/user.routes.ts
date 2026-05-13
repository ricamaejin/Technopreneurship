import { Router } from "express";
import {
  createUserHandler,
  getUsersHandler,
  getUserByIdHandler,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getUsersHandler);
router.post("/", createUserHandler);
router.get("/:id", getUserByIdHandler);

export default router;
