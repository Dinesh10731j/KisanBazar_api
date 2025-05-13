import express from "express";
import {
  adminDashBoard,
  overView,
  manageUsers,
  deleteUser,
  changeUserRole,
  Orders,
  adminSetting,
} from "./admin.controller";
import validate from "../middleware/validate";
import { profileValidator } from "../validator/validator";

const adminRouter = express.Router();

adminRouter.get("/dashboard", adminDashBoard);
adminRouter.get("/overview", overView);
adminRouter.get("/manage-users", manageUsers);
adminRouter.delete("/:id", deleteUser);
adminRouter.patch("/:id", changeUserRole);
adminRouter.get("/orders", Orders);
adminRouter.put("/:userId", profileValidator,validate,adminSetting);
export default adminRouter;
