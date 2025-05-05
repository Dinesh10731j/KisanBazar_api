"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const farmer_controller_1 = require("./farmer.controller");
const multer_1 = __importDefault(require("../middleware/multer"));
const validator_1 = require("../validator/validator");
const validate_1 = __importDefault(require("../middleware/validate"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const farmerRouter = (0, express_1.Router)();
farmerRouter.post("/add-products", multer_1.default.single("image"), authMiddleware_1.authenticateUser, validator_1.productValidator, validate_1.default, farmer_controller_1.addProducts);
exports.default = farmerRouter;
