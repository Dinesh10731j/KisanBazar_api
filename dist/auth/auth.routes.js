"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const validator_1 = require("../validator/validator");
const validate_1 = __importDefault(require("../middleware/validate"));
const AuthRouter = express_1.default.Router();
AuthRouter.post("/register", validator_1.registerValidator, validate_1.default, auth_controller_1.registerUser);
AuthRouter.post("/login", validator_1.loginValidator, validate_1.default, auth_controller_1.loginUser);
AuthRouter.post("/contact", validator_1.contactValidator, validate_1.default, auth_controller_1.ContactUs);
exports.default = AuthRouter;
