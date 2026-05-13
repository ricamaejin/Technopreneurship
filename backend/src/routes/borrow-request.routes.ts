import { Router } from "express";
import {
  createBorrowRequestHandler,
  getBorrowRequestsHandler,
  getBorrowRequestByIdHandler,
  getBorrowRequestsByBorrowerIdHandler,
  getBorrowRequestsByOwnerIdHandler,
  updateBorrowRequestHandler,
} from "../controllers/borrow-request.controller";

const router = Router();

router.get("/", getBorrowRequestsHandler);
router.post("/", createBorrowRequestHandler);
router.get("/:id", getBorrowRequestByIdHandler);
router.get("/borrower/:borrowerId", getBorrowRequestsByBorrowerIdHandler);
router.get("/owner/:ownerId", getBorrowRequestsByOwnerIdHandler);
router.put("/:id", updateBorrowRequestHandler);

export default router;
