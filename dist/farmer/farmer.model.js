"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Products = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true
    },
    farmerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true });
const Product = (0, mongoose_1.model)("Product", Products);
exports.default = Product;
