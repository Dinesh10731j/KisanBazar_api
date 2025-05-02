"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
const { env } = config_1.default;
const globalErrorHandler = (err, req, res, next) => {
    void next;
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message,
        errorStack: env === "development" ? err.stack : "",
    });
};
exports.default = globalErrorHandler;
