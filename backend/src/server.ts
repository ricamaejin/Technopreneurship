import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db";
import userRoutes from "./routes/user.routes";
import itemRoutes from "./routes/item.routes";
import borrowRequestRoutes from "./routes/borrow-request.routes";
import adminRoutes from "./routes/admin.routes";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/borrow-requests", borrowRequestRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});