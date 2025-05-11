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
exports.adminDashBoard = void 0;
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
