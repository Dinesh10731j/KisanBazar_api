import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../users/users.model";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
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
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
