"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const { Jwt_Secret } = config_1.default;
const authenticateUser = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized", success: false });
            return;
        }
        if (!token) {
            res.status(401).json({ message: "Unauthorized", success: false });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, Jwt_Secret);
        const _req = req;
        _req.userId = decoded.userId;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next((0, http_errors_1.default)(401, "Invalid or expired token"));
            return;
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            next((0, http_errors_1.default)(401, "Token has expired"));
            return;
        }
        if (error instanceof Error) {
            next((0, http_errors_1.default)(500, error.message));
            return;
        }
        next((0, http_errors_1.default)(500, "An unexpected error occurred"));
        return;
    }
};
exports.authenticateUser = authenticateUser;
