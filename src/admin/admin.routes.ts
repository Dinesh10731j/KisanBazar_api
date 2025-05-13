import express from "express";
import {
  adminDashBoard,
  overView,
  manageUsers,
  deleteUser,
  changeUserRole,
  Orders,
} from "./admin.controller";
const adminRouter = express.Router();

adminRouter.get("/dashboard", adminDashBoard);
adminRouter.get("/overview", overView);
adminRouter.get("/manage-users", manageUsers);
adminRouter.delete("/:id", deleteUser);
adminRouter.patch("/:id", changeUserRole);
adminRouter.get("/orders", Orders);
export default adminRouter;
