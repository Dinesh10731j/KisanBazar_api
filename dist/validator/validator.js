"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsDeliveredValidator = exports.getLocationValidator = exports.updateLocationValidator = exports.createLocationValidator = exports.profileValidator = exports.productValidator = exports.contactValidator = exports.loginValidator = exports.registerValidator = void 0;
// src/users/user.validator.ts
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
exports.registerValidator = [
    (0, express_validator_1.body)("username").trim().notEmpty().withMessage("Username is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Please provide a valid email address"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];
exports.loginValidator = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Please provide a valid email address"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
];
exports.contactValidator = [
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Please provide a valid email address"),
    (0, express_validator_1.body)("message")
        .isLength({ min: 10 })
        .withMessage("Message must be at least 10 characters long")
];
exports.productValidator = [
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("Product name is required"),
    (0, express_validator_1.body)("price").isNumeric().withMessage("Price must be a number"),
    (0, express_validator_1.body)("quantity").isString().withMessage("Quantity must be a string"),
    (0, express_validator_1.body)("description")
        .isLength({ min: 10 })
        .withMessage("Description must be at least 10 characters long"),
];
exports.profileValidator = [
    (0, express_validator_1.body)("username").trim().notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Please provide a valid email address"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];
//location validator
const isValidObjectId = (value) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid Order ID');
    }
    return true;
};
exports.createLocationValidator = [
    (0, express_validator_1.body)('orderId').custom(isValidObjectId),
    (0, express_validator_1.body)('userLocation')
        .optional()
        .custom(loc => typeof loc.lat === 'number' && typeof loc.lng === 'number')
        .withMessage('userLocation must include valid lat and lng'),
    (0, express_validator_1.body)('farmerLocation')
        .optional()
        .custom(loc => typeof loc.lat === 'number' && typeof loc.lng === 'number')
        .withMessage('farmerLocation must include valid lat and lng'),
];
exports.updateLocationValidator = [
    (0, express_validator_1.body)('orderId').custom(isValidObjectId),
    (0, express_validator_1.body)('role')
        .isIn(['user', 'farmer'])
        .withMessage('Role must be either "user" or "farmer"'),
    (0, express_validator_1.body)('location.lat')
        .isNumeric()
        .withMessage('Latitude must be a number'),
    (0, express_validator_1.body)('location.lng')
        .isNumeric()
        .withMessage('Longitude must be a number'),
];
exports.getLocationValidator = [
    (0, express_validator_1.param)('orderId').custom(isValidObjectId),
];
exports.markAsDeliveredValidator = [
    (0, express_validator_1.param)('orderId').custom(isValidObjectId),
];
