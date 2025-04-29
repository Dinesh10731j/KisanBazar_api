// src/routes/userRoutes.ts
import express from "express";
import { registerUser, loginUser } from "./users.controller";
import { registerValidator, loginValidator } from "../validator/validator";
import validate from "../middleware/validate";
const UserRouter = express.Router();
UserRouter.post("/register", registerValidator, validate, registerUser);
UserRouter.post("/login", loginValidator, validate, loginUser);
export default UserRouter;
