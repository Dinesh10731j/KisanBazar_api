"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileValidator = exports.productValidator = exports.contactValidator = exports.loginValidator = exports.registerValidator = void 0;
// src/users/user.validator.ts
const express_validator_1 = require("express-validator");
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
