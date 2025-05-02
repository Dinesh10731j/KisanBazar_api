"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payments_controller_1 = require("./payments.controller");
const paymentRouter = (0, express_1.Router)();
paymentRouter.post("/initiate", payments_controller_1.createOrderAndInitiate);
exports.default = paymentRouter;
