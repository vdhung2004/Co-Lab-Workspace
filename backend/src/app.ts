// src/app.ts
import express, { Application, Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import workspaceRoutes from "./routes/workspace.routes";
import spaceRoutes from "./routes/space.route";
import amenityRoutes from "./routes/amenity.route";
import floorRoutes from "./routes/floor.route";

const app: Application = express();

const CLIENT_URL: string = process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  cors({
    origin: CLIENT_URL, // Cho phép Frontend của bạn truy cập
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, // Nếu bạn sử dụng cookie hoặc Authorization header
  })
);

app.use(express.json());

// Route test cơ bản
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "API đang chạy!",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // Thêm route user ở đây
app.use("/api/workspace", workspaceRoutes);
app.use("/api/space", spaceRoutes);
app.use("/api/amenity", amenityRoutes);
app.use("/api/floor", floorRoutes);

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Lỗi Server không xác định",
  });
});

export default app;
