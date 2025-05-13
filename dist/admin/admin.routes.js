"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const validate_1 = __importDefault(require("../middleware/validate"));
const validator_1 = require("../validator/validator");
const adminRouter = express_1.default.Router();
adminRouter.get("/dashboard", admin_controller_1.adminDashBoard);
adminRouter.get("/overview", admin_controller_1.overView);
adminRouter.get("/manage-users", admin_controller_1.manageUsers);
adminRouter.delete("/:id", admin_controller_1.deleteUser);
adminRouter.patch("/:id", admin_controller_1.changeUserRole);
adminRouter.get("/orders", admin_controller_1.Orders);
adminRouter.put("/:userId", validator_1.profileValidator, validate_1.default, admin_controller_1.adminSetting);
exports.default = adminRouter;
