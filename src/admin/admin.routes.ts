import express from "express";
import { adminDashBoard } from "./admin.controller";
const adminRouter = express.Router();

adminRouter.get("/dashboard",adminDashBoard);

export default adminRouter ;
