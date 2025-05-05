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
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config/config"));
const globalErrorMiddleware_1 = __importDefault(require("./middleware/globalErrorMiddleware"));
const { PORT } = config_1.default;
const db_1 = __importDefault(require("./config/db"));
const users_routes_1 = __importDefault(require("./users/users.routes"));
const payments_route_1 = __importDefault(require("./payments/payments.route"));
const farmer_routes_1 = __importDefault(require("./farmer/farmer.routes"));
const cors_1 = __importDefault(require("cors"));
const server = (0, express_1.default)();
server.use(express_1.default.json());
server.use(globalErrorMiddleware_1.default);
server.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://kisanbazar.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
}));
// API Routes
server.use("/api/v1/users", users_routes_1.default);
server.use("/api/v1/payments", payments_route_1.default);
server.use("/api/v1/farmers", farmer_routes_1.default);
server.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        console.log(`Listening on port ${PORT}`);
    }
    catch (error) {
        console.error("Failed to connect to database", error);
        process.exit(1);
    }
}));
