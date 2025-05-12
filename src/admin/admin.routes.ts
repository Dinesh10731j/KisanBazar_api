import express from "express";
import { adminDashBoard,overView } from "./admin.controller";
const adminRouter = express.Router();

adminRouter.get("/dashboard",adminDashBoard);
adminRouter.get("/overview",overView);

export default adminRouter ;
