import express, { Express } from "express";
import Configuration from "./config/config";
const { PORT } = Configuration;
const server: Express = express();
server.listen(PORT, (): void => {
  console.log(`Server is running on port ${PORT}`);
});
