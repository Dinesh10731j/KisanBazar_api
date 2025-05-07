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
exports.getAllProducts = exports.updateProfile = exports.updateProduct = exports.deleteProduct = exports.getProducts = exports.addProducts = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const farmer_model_1 = __importDefault(require("./farmer.model"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const users_model_1 = require("../users/users.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const addProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, quantity, description } = req.body;
    if (!name || !price || !quantity || !description) {
        return next((0, http_errors_1.default)(400, "All fields are required"));
    }
    if (!req.file) {
        return next((0, http_errors_1.default)(400, "Image file is required"));
    }
    const filePath = path_1.default.resolve(__dirname, "../../uploads", req.file.filename);
    try {
        const _req = req;
        if (!_req.userId) {
            return next((0, http_errors_1.default)(400, "Instructor id is missing"));
        }
        const uploadResult = yield cloudinary_1.default.uploader.upload(filePath, {
            folder: "kisan_bazar",
            public_id: req.file.filename.split(".")[0],
        });
        fs_1.default.unlinkSync(filePath);
        const product = new farmer_model_1.default({
            name,
            price,
            quantity,
            description,
            imageUrl: uploadResult.secure_url,
            farmerId: _req.userId,
        });
        yield product.save();
        res.status(201).json({ message: "Product added successfully" });
    }
    catch (error) {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        console.error("Upload error:", error);
        return next((0, http_errors_1.default)(500, "Image upload or product creation failed"));
    }
});
exports.addProducts = addProducts;
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _req = req;
        if (!_req.userId) {
            return next((0, http_errors_1.default)(400, "Instructor id is missing"));
        }
        const products = yield farmer_model_1.default.find({ farmerId: _req.userId });
        if (!products) {
            return next((0, http_errors_1.default)(404, "No products found"));
        }
        if (products.length === 0) {
            return next((0, http_errors_1.default)(404, "No products found"));
        }
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        return next((0, http_errors_1.default)(500, "Failed to fetch products"));
    }
});
exports.getProducts = getProducts;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    try {
        const deletedProduct = yield farmer_model_1.default.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return next((0, http_errors_1.default)(404, "Product not found"));
        }
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        return next((0, http_errors_1.default)(500, "Failed to delete product"));
    }
});
exports.deleteProduct = deleteProduct;
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const { name, price, quantity, description } = req.body;
    if (!name || !price || !quantity || !description) {
        return next((0, http_errors_1.default)(400, "All fields are required"));
    }
    try {
        const updatedProduct = yield farmer_model_1.default.findByIdAndUpdate(productId, { name, price, quantity, description }, { new: true });
        if (!updatedProduct) {
            return next((0, http_errors_1.default)(404, "Product not found"));
        }
        res.status(200).json({ message: "Product updated successfully" });
    }
    catch (error) {
        console.error("Error updating product:", error);
        return next((0, http_errors_1.default)(500, "Failed to update product"));
    }
});
exports.updateProduct = updateProduct;
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const _req = req;
    const userId = _req.userId;
    if (!userId) {
        return next((0, http_errors_1.default)(400, "User id is missing"));
    }
    if (!username || !email || !password) {
        return next((0, http_errors_1.default)(400, "All fields are required"));
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    try {
        const updatedFarmer = yield users_model_1.User.findByIdAndUpdate(userId, { username, email, password: hashedPassword }, { new: true });
        if (!updatedFarmer) {
            return next((0, http_errors_1.default)(404, "Farmer not found"));
        }
        res.status(200).json({ message: "Profile updated successfully" });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        return next((0, http_errors_1.default)(500, "Failed to update profile"));
    }
});
exports.updateProfile = updateProfile;
const getAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield farmer_model_1.default.find({});
        if (!products) {
            return next((0, http_errors_1.default)(404, "No products found"));
        }
        if (products.length === 0) {
            return next((0, http_errors_1.default)(404, "No products found"));
        }
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        return next((0, http_errors_1.default)(500, "Failed to fetch products"));
    }
});
exports.getAllProducts = getAllProducts;
