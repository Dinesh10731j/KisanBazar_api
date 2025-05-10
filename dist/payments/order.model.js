"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    customerName: { type: mongoose_1.default.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    productIds: [{ type: String, required: true }],
    farmerIds: [{ type: mongoose_1.default.Types.ObjectId, required: true, ref: "Product" }],
    products: [{ name: String, price: Number, quantity: Number }],
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['eSewa', 'Khalti', 'onCash'], required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
    transactionId: String
}, { timestamps: true });
const Order = mongoose_1.default.model('Order', orderSchema);
exports.default = Order;
