"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../order/order.controller");
const paymentRouter = (0, express_1.Router)();
paymentRouter.post("/initiate", order_controller_1.createOrderAndInitiate);
exports.default = paymentRouter;
