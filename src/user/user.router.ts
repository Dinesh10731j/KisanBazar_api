import { Router } from "express";
import { getUserDashboard,userOrderDetails } from "./user.controller";
const userDashBoardRouter = Router();

userDashBoardRouter.get("/:userId", getUserDashboard);
userDashBoardRouter.get("/order-details/:userId",userOrderDetails)

export default userDashBoardRouter;
