"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const location_controller_1 = require("./location.controller");
const validator_1 = require("../validator/validator");
const validate_1 = __importDefault(require("../middleware/validate"));
const locationRouter = (0, express_1.Router)();
locationRouter.post('/createLocation', validator_1.createLocationValidator, validate_1.default, location_controller_1.createLocation);
locationRouter.patch('/updateLocation', validator_1.updateLocationValidator, validate_1.default, location_controller_1.updateLocation);
locationRouter.get('/:orderId', validator_1.getLocationValidator, validate_1.default, location_controller_1.getLocation);
locationRouter.patch('/:orderId/delivered', validator_1.markAsDeliveredValidator, validate_1.default, location_controller_1.markAsDelivered);
exports.default = locationRouter;
