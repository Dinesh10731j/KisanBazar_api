"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("./users.controller");
const validator_1 = require("../validator/validator");
const validate_1 = __importDefault(require("../middleware/validate"));
const UserRouter = express_1.default.Router();
UserRouter.post("/register", validator_1.registerValidator, validate_1.default, users_controller_1.registerUser);
UserRouter.post("/login", validator_1.loginValidator, validate_1.default, users_controller_1.loginUser);
UserRouter.post("/contact", validator_1.contactValidator, validate_1.default, users_controller_1.ContactUs);
exports.default = UserRouter;
