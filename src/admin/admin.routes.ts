import express from "express";
import { adminDashBoard, overView, manageUsers,deleteUser,changeUserRole } from "./admin.controller";
const adminRouter = express.Router();

adminRouter.get("/dashboard", adminDashBoard);
adminRouter.get("/overview", overView);
adminRouter.get("/manage-users", manageUsers);
adminRouter.delete("/:id",deleteUser);
adminRouter.patch("/:id",changeUserRole);
export default adminRouter;
