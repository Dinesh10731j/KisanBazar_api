"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const userDashBoardRouter = (0, express_1.Router)();
userDashBoardRouter.get("/:userId", user_controller_1.getUserDashboard);
userDashBoardRouter.get("/order-details/:userId", user_controller_1.userOrderDetails);
exports.default = userDashBoardRouter;
