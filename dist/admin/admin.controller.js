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
exports.deleteUser = exports.changeUserRole = exports.manageUsers = exports.overView = exports.adminDashBoard = void 0;
const order_model_1 = __importDefault(require("../payments/order.model"));
const users_model_1 = require("../users/users.model");
const farmer_model_1 = __importDefault(require("../farmer/farmer.model"));
const http_errors_1 = __importDefault(require("http-errors"));
const adminDashBoard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const totalFarmers = yield users_model_1.User.countDocuments({ role: "user" });
        const totalOrders = yield order_model_1.default.countDocuments();
        const deliveredOrders = yield order_model_1.default.countDocuments({ status: "Delivered" });
        const totalRevenue = yield order_model_1.default.aggregate([
            { $match: { status: "Delivered" } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const totalProducts = yield farmer_model_1.default.countDocuments();
        const totalCustomers = yield users_model_1.User.countDocuments({ role: "user" });
        const firstOrder = yield order_model_1.default.findOne().sort({ createdAt: 1 });
        if (!firstOrder) {
            res.status(200).json({
                totalFarmers,
                totalOrders,
                deliveredOrders,
                revenue: 0,
                totalCustomers,
                totalProducts,
                ordersOverTime: [],
            });
        }
        const startDate = firstOrder ? new Date(firstOrder.get('createdAt')) : new Date();
        const ordersOverTime = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startDate);
            day.setDate(day.getDate() + i);
            const start = new Date(day.toISOString().split("T")[0] + "T00:00:00.000Z");
            const end = new Date(day.toISOString().split("T")[0] + "T23:59:59.999Z");
            const orders = yield order_model_1.default.find({
                createdAt: {
                    $gte: start,
                    $lte: end,
                },
            }).select("_id customerName productIds farmerIds products amount paymentMethod paymentStatus createdAt").lean();
            ordersOverTime.push({
                date: day.toISOString().split("T")[0],
                orders,
            });
        }
        res.status(200).json({
            totalFarmers,
            totalOrders,
            deliveredOrders,
            revenue: ((_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
            totalCustomers,
            totalProducts,
            ordersOverTime,
        });
    }
    catch (error) {
        console.error(error);
        return next((0, http_errors_1.default)(500, "Internal server error"));
    }
});
exports.adminDashBoard = adminDashBoard;
const overView = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalOrders = yield order_model_1.default.countDocuments();
        const now = new Date();
        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - now.getDay());
        const startOfLastWeek = new Date(startOfThisWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(endOfLastWeek.getDate() + 6);
        const thisWeekOrders = yield order_model_1.default.countDocuments({
            createdAt: { $gte: startOfThisWeek, $lte: now },
        });
        const lastWeekOrders = yield order_model_1.default.countDocuments({
            createdAt: { $gte: startOfLastWeek, $lte: endOfLastWeek },
        });
        const percentChange = lastWeekOrders === 0
            ? 100
            : ((thisWeekOrders - lastWeekOrders) / lastWeekOrders) * 100;
        const firstOrder = yield order_model_1.default.findOne().sort({ createdAt: 1 }).select("createdAt");
        if (!firstOrder) {
            res.status(200).json({
                totalOrders,
                percentChange: "0%",
                ordersOverTime: [],
            });
            return;
        }
        const startDate = new Date(firstOrder.get('createdAt'));
        const endDate = new Date(); // today
        const ordersOverTime = [];
        // Loop through each day from startDate to endDate
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const day = new Date(d);
            const start = new Date(day.toISOString().split("T")[0] + "T00:00:00.000Z");
            const end = new Date(day.toISOString().split("T")[0] + "T23:59:59.999Z");
            const count = yield order_model_1.default.countDocuments({
                createdAt: { $gte: start, $lte: end },
            });
            ordersOverTime.push({
                date: day.toISOString().split("T")[0],
                orderCount: count,
            });
        }
        res.status(200).json({
            totalOrders,
            percentChange: `${percentChange >= 0 ? "+" : ""}${percentChange.toFixed(2)}%`,
            ordersOverTime,
        });
    }
    catch (error) {
        console.error(error);
        return next((0, http_errors_1.default)(500, "Internal server error"));
    }
});
exports.overView = overView;
const manageUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield users_model_1.User.find().select("username email role");
        res.status(200).json({
            success: true,
            users,
        });
    }
    catch (error) {
        console.error(error);
        return next((0, http_errors_1.default)(500, "Internal server error"));
    }
});
exports.manageUsers = manageUsers;
const changeUserRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !["admin", "farmer", "user"].includes(role)) {
        res.status(400).json({ message: "Invalid or missing role." });
        return;
    }
    try {
        const user = yield users_model_1.User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        res.status(200).json({
            message: "User role updated successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.changeUserRole = changeUserRole;
// DELETE /api/users/:id - Delete user
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield users_model_1.User.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
