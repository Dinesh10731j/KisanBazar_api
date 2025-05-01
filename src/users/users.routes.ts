// src/routes/userRoutes.ts
import express from "express";
import { registerUser, loginUser ,ContactUs} from "./users.controller";
import { registerValidator, loginValidator,contactValidator } from "../validator/validator";
import validate from "../middleware/validate";
const UserRouter = express.Router();
UserRouter.post("/register", registerValidator, validate, registerUser);
UserRouter.post("/login", loginValidator, validate, loginUser);
UserRouter.post("/contact",contactValidator,validate,ContactUs)
export default UserRouter;
