import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../users/users.model";
import Configuration from "../config/config";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

const { Jwt_Secret } = Configuration;

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createHttpError(400, "User with this email already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
    return next(createHttpError(500, "Server error"));
    }
    return next(createHttpError(500, "Server error"));

  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(401, "Invalid email or password"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createHttpError(401, "Invalid email or password"));
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      Jwt_Secret as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({ access_token: token, message: "Login successful" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return next(createHttpError(500, "Server error"));
    }
    return next(createHttpError(500, "Server error"));
   
  }
};
