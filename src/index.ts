import express, { Express } from "express";
import Configuration from "./config/config";
const { PORT } = Configuration;
import connectDB from "./config/db";
import UserRouter from "./users/users.routes";
import cors from "cors";
const server: Express = express();
server.use(express.json());
server.use(
  cors({
    origin: "*",
  })
);

server.use("/api/v1/users", UserRouter);
server.listen(PORT, async (): Promise<void> => {
  try {
    await connectDB();
    console.log(`Listening on port ${PORT}`);
  } catch (error) {
    console.error("Failed to connect to database", error);
    process.exit(1);
  }
});
