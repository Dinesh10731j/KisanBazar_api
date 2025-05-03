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
exports.ContactUs = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users_model_1 = require("./users.model");
const config_1 = __importDefault(require("../config/config"));
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { Jwt_Secret } = config_1.default;
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return next((0, http_errors_1.default)(400, "All fields are required"));
    }
    try {
        const existingUser = yield users_model_1.User.findOne({ email });
        if (existingUser) {
            return next((0, http_errors_1.default)(400, "User with this email already exists"));
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = new users_model_1.User({
            username,
            email,
            password: hashedPassword,
            role: "user",
        });
        yield user.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            return next((0, http_errors_1.default)(500, "Server error"));
        }
        return next((0, http_errors_1.default)(500, "Server error"));
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return next((0, http_errors_1.default)(400, "Email and password are required"));
    }
    try {
        const user = yield users_model_1.User.findOne({ email });
        if (!user) {
            next((0, http_errors_1.default)(401, "Invalid email or password"));
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            next((0, http_errors_1.default)(401, "Invalid email or password"));
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email, role: user.role }, Jwt_Secret, { expiresIn: "1h" });
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 60 * 60 * 1000
        })
            .status(200)
            .json({ message: "Login successful" });
    }
    catch (error) {
        if (error instanceof Error) {
            return next((0, http_errors_1.default)(500, "Server error"));
        }
        return next((0, http_errors_1.default)(500, "Server error"));
    }
});
exports.loginUser = loginUser;
const ContactUs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return next((0, http_errors_1.default)(400, "All fields are required"));
    }
    try {
        const existsingEmail = yield users_model_1.Contact.findOne({ email });
        if (existsingEmail) {
            return next((0, http_errors_1.default)(400, "Email already exists we will contact you soon"));
        }
        const contact = new users_model_1.Contact({
            name,
            email,
            message,
        });
        yield contact.save();
        res.status(201).json({ message: "Contact created successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            return next((0, http_errors_1.default)(500, "Server error"));
        }
        return next((0, http_errors_1.default)(500, "Server error"));
    }
    res.status(200).json({ message: "Contact created successfully" });
    return;
});
exports.ContactUs = ContactUs;
