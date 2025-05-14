// src/routes/userRoutes.ts
import express from "express";
import { registerUser, loginUser, ContactUs } from "./auth.controller";
import {
  registerValidator,
  loginValidator,
  contactValidator,
} from "../validator/validator";
import validate from "../middleware/validate";
const AuthRouter = express.Router();
AuthRouter.post("/register", registerValidator, validate, registerUser);
AuthRouter.post("/login", loginValidator, validate, loginUser);
AuthRouter.post("/contact", contactValidator, validate, ContactUs);
export default AuthRouter;
