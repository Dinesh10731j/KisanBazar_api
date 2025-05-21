"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleForgotPassword = exports.userOrderDetails = exports.getUserDashboard = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const order_model_1 = __importDefault(require("../order/order.model"));
const nodemailer_1 = require("../services/nodemailer");
const auth_model_1 = require("../auth/auth.model");
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getUserDashboard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!userId)
            return next((0, http_errors_1.default)(400, "User ID is required"));
        const orders = yield order_model_1.default.find({ customerId: userId });
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((acc, order) => acc + (order.amount || 0), 0);
        const lastOrderDate = orders.length > 0
            ? new Date(Math.max(...orders.map((order) => new Date(order.get("createdAt")).getTime())))
            : null;
        const productCategoryCount = {};
        orders.forEach((order) => {
            var _a;
            (_a = order.products) === null || _a === void 0 ? void 0 : _a.forEach((product) => {
                const name = product.name;
                const quantity = product.quantity || 1;
                productCategoryCount[name] = (productCategoryCount[name] || 0) + quantity;
            });
        });
        // Count orders grouped by month and year
        const orderMonthlyCount = {};
        orders.forEach((order) => {
            const date = new Date(order.get("createdAt"));
            const monthYear = date.toLocaleString("default", {
                month: "short",
                year: "numeric",
            }); // e.g., "Apr 2025"
            orderMonthlyCount[monthYear] = (orderMonthlyCount[monthYear] || 0) + 1;
        });
        res.json({
            totalOrders,
            totalSpent,
            lastOrderDate,
            productCategoryCount,
            orderMonthlyCount,
        });
    }
    catch (error) {
        console.error(error);
        return next((0, http_errors_1.default)(500, "Internal server error"));
    }
});
exports.getUserDashboard = getUserDashboard;
const userOrderDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return next((0, http_errors_1.default)(400, 'User ID is required.'));
        }
        const orders = yield order_model_1.default.find({ customerId: userId });
        if (!orders || orders.length === 0) {
            return next((0, http_errors_1.default)(404, 'No orders found for this user.'));
        }
        const orderDetails = orders.map((order) => ({
            orderId: order.orderId || "Unknown Order ID",
            date: order.get("createdAt"),
            status: order.paymentStatus,
            amount: order.amount,
            paymentMethod: order.paymentMethod,
            products: order.products.map((product) => ({
                name: product.name,
                price: product.price,
                quantity: product.quantity
            }))
        }));
        res.status(200).json({
            success: true,
            message: 'Order details fetched successfully.',
            data: orderDetails
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, error instanceof Error ? error.message : 'An unknown error occurred'));
    }
});
exports.userOrderDetails = userOrderDetails;
const handleForgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return next((0, http_errors_1.default)(400, "Email is required."));
        }
        const user = yield auth_model_1.User.findOne({ email });
        if (!user) {
            return next((0, http_errors_1.default)(404, "User with this email does not exist."));
        }
        // Generate random password
        const temporaryPassword = crypto_1.default.randomBytes(4).toString("hex"); // 8-character random password
        // Hash the password using bcrypt
        const hashedPassword = yield bcryptjs_1.default.hash(temporaryPassword, 10);
        // Update user password in DB
        user.password = hashedPassword;
        yield user.save();
        // Send the temporary password via email
        yield (0, nodemailer_1.sendForgotPasswordEmail)(email, temporaryPassword);
        res.status(200).json({
            message: "A new temporary password has been sent to your email.",
        });
    }
    catch (error) {
        console.error("Forgot Password Error:", error);
        return next((0, http_errors_1.default)(500, error instanceof Error ? error.message : "Something went wrong."));
    }
});
exports.handleForgotPassword = handleForgotPassword;
