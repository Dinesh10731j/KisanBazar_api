import express, { Express } from "express";
import Configuration from "./config/config";
import globalErrorHandler from "./middleware/globalErrorMiddleware";
const { PORT } = Configuration;
import connectDB from "./config/db";
import UserRouter from "./users/users.routes";
import cors from "cors";
const server: Express = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(
  cors({
    origin: "http://localhost:3000",
  })
);
server.use("/api/v1/users", UserRouter);
server.use(globalErrorHandler);


server.listen(PORT, async (): Promise<void> => {
  try {
    await connectDB();
    console.log(`Listening on port ${PORT}`);
  } catch (error) {
    console.error("Failed to connect to database", error);
    process.exit(1);
  }
});
