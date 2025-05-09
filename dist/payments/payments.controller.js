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
const order_model_1 = __importDefault(require("./order.model"));
const e_sewa_service_1 = require("./services/e-sewa.service");
const khalti_service_1 = require("./services/khalti.service");
const http_errors_1 = __importDefault(require("http-errors"));
const createOrderAndInitiate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerName, products, paymentMethod, amount, productIds, farmerIds } = req.body;
        if (!customerName || !products || !paymentMethod || !amount || !productIds) {
            return next((0, http_errors_1.default)(400, 'Missing required order fields.'));
        }
        const order = yield order_model_1.default.create({
            customerName,
            productIds,
            farmerIds,
            products,
            amount,
            paymentMethod,
        });
        if (paymentMethod === 'eSewa') {
            const payload = (0, e_sewa_service_1.generateEsewaPayload)({ amount, orderId: order._id.toString() });
            res.json({
                paymentUrl: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
                payload,
            });
            return;
        }
        const token = 12345;
        if (paymentMethod === 'Khalti') {
            const payload = yield (0, khalti_service_1.verifyKhaltiPayment)(amount, token);
            res.json({
                paymentUrl: 'https://test.khalti.com/checkout',
                orderId: order._id,
                payload,
            });
            return;
        }
        if (paymentMethod === 'onCash') {
            yield order_model_1.default.findByIdAndUpdate(order._id, { paymentStatus: 'Success' });
            res.json({
                message: 'Cash on Delivery order placed successfully.',
                orderId: order._id,
            });
            return;
        }
        return next((0, http_errors_1.default)(400, 'Invalid payment method'));
    }
    catch (error) {
        return next(error);
    }
});
exports.createOrderAndInitiate = createOrderAndInitiate;
