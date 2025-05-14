"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    customerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    productIds: [
        { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: "Product" },
    ],
    farmerIds: [
        { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: "User" },
    ],
    products: [{ name: String, price: Number, quantity: Number }],
    amount: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ["eSewa", "Khalti", "onCash"],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Success", "Failed"],
        default: "Pending",
    },
    transactionId: { type: String },
}, { timestamps: true });
const Order = mongoose_1.default.model("Order", orderSchema);
exports.default = Order;
