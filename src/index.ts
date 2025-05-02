import express, { Express } from "express";
import Configuration from "./config/config";
import globalErrorHandler from "./middleware/globalErrorMiddleware";
const { PORT } = Configuration;
import connectDB from "./config/db";
import UserRouter from "./users/users.routes";
import paymentRouter from "./payments/payments.route";
import cors from "cors";
const server: Express = express();
server.use(express.json());
server.use(globalErrorHandler);
server.use(
  cors({
    origin: ["http://localhost:3000", "https://kisanbazar.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

// API Routes
server.use("/api/v1/users", UserRouter);
server.use("/api/v1/payments", paymentRouter);

server.listen(PORT, async (): Promise<void> => {
  try {
    await connectDB();
    console.log(`Listening on port ${PORT}`);
  } catch (error) {
    console.error("Failed to connect to database", error);
    process.exit(1);
  }
});
