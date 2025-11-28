// src/app.ts
import express, { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Cho phép Frontend của bạn truy cập
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, // Nếu bạn sử dụng cookie hoặc Authorization header
  })
);

app.use(express.json()); // Cho phép đọc body JSON

// Route test cơ bản
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "API đang chạy!",
  });
});

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Lỗi Server không xác định",
  });
});

export default app;
