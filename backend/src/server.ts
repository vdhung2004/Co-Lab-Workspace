import app from "./app";
import "dotenv/config";
import { createServer, Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { prisma } from "./lib/prisma";

const PORT: number = parseInt(process.env.PORT || "5000", 10);
const CLIENT_URL: string = process.env.CLIENT_URL || "http://localhost:3000";

const server: HttpServer = createServer(app);
const io: SocketIOServer = new SocketIOServer(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket) => {
  console.log(`New client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Hàm xử lý ngắt kết nối (Shut Down Gracefully)
async function shutdown() {
  console.log("Đang đóng kết nối DB...");
  await prisma.$disconnect(); // Gọi hàm ngắt kết nối của Prisma
  server.close(() => {
    console.log("Server đã đóng.");
    process.exit(0);
  });
}

// Lắng nghe các sự kiện chấm dứt tiến trình
process.on("SIGTERM", shutdown); // Dùng cho các môi trường như Docker
process.on("SIGINT", shutdown); // Dùng khi nhấn Ctrl+C
