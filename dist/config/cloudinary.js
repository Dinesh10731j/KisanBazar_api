"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("./config"));
const { Cloudinary_Api_Key, Cloudinary_Api_Secret, Cloudinary_Name } = config_1.default;
cloudinary_1.v2.config({
    cloud_name: Cloudinary_Name,
    api_key: Cloudinary_Api_Key,
    api_secret: Cloudinary_Api_Secret
});
exports.default = cloudinary_1.v2;
