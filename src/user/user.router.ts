import { Router } from "express";
import { getUserDashboard } from "./user.controller";
const userDashBoardRouter = Router();

userDashBoardRouter.get("/:userId", getUserDashboard);

export default userDashBoardRouter;
