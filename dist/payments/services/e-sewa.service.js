"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEsewaPayload = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateHmacSha256Hash = (data, secret) => {
    return crypto_1.default.createHmac('sha256', secret).update(data).digest('hex');
};
const generateEsewaPayload = ({ amount, orderId, }) => {
    const secretKey = '8gBm/:&EnhH.1/q'; // test secret
    const signedFieldNames = 'amount,transaction_uuid,product_code';
    const signatureString = `amount=${amount},transaction_uuid=${orderId},product_code=EPAYTEST`;
    const signature = generateHmacSha256Hash(signatureString, secretKey);
    return {
        amount,
        tax_amount: 0,
        total_amount: amount,
        transaction_uuid: orderId,
        product_code: 'EPAYTEST',
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: `http://localhost:5000/api/payments/esewa/success`,
        failure_url: `http://localhost:5000/api/payments/esewa/failure`,
        signed_field_names: signedFieldNames,
        signature,
    };
};
exports.generateEsewaPayload = generateEsewaPayload;
