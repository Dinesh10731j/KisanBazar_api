// src/users/user.validator.ts
import { body,param } from "express-validator";
import mongoose from "mongoose";
export const registerValidator = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const contactValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("message")
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters long")
];

export const productValidator = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("quantity").isString().withMessage("Quantity must be a string"),
  body("description")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
];


export const profileValidator=[
  body("username").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

]

//location validator
const isValidObjectId = (value: string) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error('Invalid Order ID');
  }
  return true;
};

export const createLocationValidator = [
  body('orderId').custom(isValidObjectId),
  body('userLocation')
    .optional()
    .custom(loc => typeof loc.lat === 'number' && typeof loc.lng === 'number')
    .withMessage('userLocation must include valid lat and lng'),
  body('farmerLocation')
    .optional()
    .custom(loc => typeof loc.lat === 'number' && typeof loc.lng === 'number')
    .withMessage('farmerLocation must include valid lat and lng'),
];

export const updateLocationValidator = [
  body('orderId').custom(isValidObjectId),
  body('role')
    .isIn(['user', 'farmer'])
    .withMessage('Role must be either "user" or "farmer"'),
  body('location.lat')
    .isNumeric()
    .withMessage('Latitude must be a number'),
  body('location.lng')
    .isNumeric()
    .withMessage('Longitude must be a number'),
];

export const getLocationValidator = [
  param('orderId').custom(isValidObjectId),
];

export const markAsDeliveredValidator = [
  param('orderId').custom(isValidObjectId),
];

