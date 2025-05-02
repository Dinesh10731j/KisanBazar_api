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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const { Mongo_Url } = config_1.default;
mongoose_1.default.connection.on('connected', () => console.log('Mongoose connected'));
mongoose_1.default.connection.on('open', () => console.log('Mongoose connection open'));
mongoose_1.default.connection.on('disconnected', () => console.log('Mongoose disconnected'));
mongoose_1.default.connection.on('reconnected', () => console.log('Mongoose reconnected'));
mongoose_1.default.connection.on('disconnecting', () => console.log('Mongoose disconnecting'));
mongoose_1.default.connection.on('close', () => console.log('Mongoose connection closed'));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(Mongo_Url);
        console.log(`MongoDB Connected: ${mongoose_1.default.connection.host}`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error connecting to MongoDB: ${error.message}`);
        }
        else {
            console.log("An unknown error occured connecting MongoDB");
        }
        process.exit(1);
    }
});
exports.default = connectDB;
