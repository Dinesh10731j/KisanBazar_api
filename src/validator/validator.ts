// src/users/user.validator.ts
import { body } from "express-validator";

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
