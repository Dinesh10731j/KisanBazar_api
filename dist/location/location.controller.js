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
exports.markAsDelivered = exports.getLocation = exports.updateLocation = exports.createLocation = void 0;
const location_model_1 = require("./location.model");
const mongoose_1 = __importDefault(require("mongoose"));
const http_errors_1 = __importDefault(require("http-errors"));
const isErrorWithMessage = (error) => {
    return typeof error === 'object' && error !== null && 'message' in error;
};
const createLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const location = yield location_model_1.Location.create(req.body);
        res.status(201).json(location);
    }
    catch (err) {
        const message = isErrorWithMessage(err) ? err.message : 'Internal Server Error';
        res.status(500).json({ error: message });
    }
});
exports.createLocation = createLocation;
const updateLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, role, location } = req.body;
        const existing = yield location_model_1.Location.findOne({ orderId });
        if (!existing)
            throw (0, http_errors_1.default)(404, 'Location not found');
        if (role === 'user') {
            existing.userLocation = location;
        }
        else {
            existing.farmerLocation = location;
        }
        existing.updatedAt = new Date();
        yield existing.save();
        res.status(200).json(existing);
    }
    catch (err) {
        const message = isErrorWithMessage(err) ? err.message : 'Internal Server Error';
        res.status(500).json({ error: message });
    }
});
exports.updateLocation = updateLocation;
const getLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            throw (0, http_errors_1.default)(400, 'Invalid Order ID');
        }
        const location = yield location_model_1.Location.findOne({ orderId });
        if (!location)
            throw (0, http_errors_1.default)(404, 'Location not found');
        res.status(200).json(location);
    }
    catch (err) {
        const message = isErrorWithMessage(err) ? err.message : 'Internal Server Error';
        res.status(500).json({ error: message });
    }
});
exports.getLocation = getLocation;
const markAsDelivered = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            throw (0, http_errors_1.default)(400, 'Invalid Order ID');
        }
        const location = yield location_model_1.Location.findOneAndUpdate({ orderId }, { isDelivered: true }, { new: true });
        if (!location)
            throw (0, http_errors_1.default)(404, 'Location not found');
        res.status(200).json(location);
    }
    catch (err) {
        const message = isErrorWithMessage(err) ? err.message : 'Internal Server Error';
        res.status(500).json({ error: message });
    }
});
exports.markAsDelivered = markAsDelivered;
