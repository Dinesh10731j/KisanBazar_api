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
exports.createOrderAndInitiate = void 0;
const order_model_1 = __importDefault(require("../order/order.model"));
const payments_controller_1 = require("../payments/payments.controller");
const http_errors_1 = __importDefault(require("http-errors"));
const createOrderAndInitiate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId, products, paymentMethod, amount, productIds, farmerIds } = req.body;
        if (!customerId || !products || !paymentMethod || !amount || !productIds) {
            return next((0, http_errors_1.default)(400, 'Missing required order fields.'));
        }
        const order = yield order_model_1.default.create({
            customerId,
            productIds,
            farmerIds,
            products,
            amount,
            paymentMethod,
        });
        switch (paymentMethod) {
            case 'eSewa':
                yield (0, payments_controller_1.handleEsewaPayment)(order._id.toString(), amount, res);
                return;
            case 'Khalti': {
                const token = 12345; // Replace this with real token from frontend
                yield (0, payments_controller_1.handleKhaltiPayment)(order._id.toString(), amount, token, res);
                return;
            }
            case 'onCash':
                yield (0, payments_controller_1.handleCashPayment)(order._id.toString(), res);
                return;
            default:
                return next((0, http_errors_1.default)(400, 'Invalid payment method'));
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.createOrderAndInitiate = createOrderAndInitiate;
