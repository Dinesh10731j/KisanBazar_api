import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { User,Contact} from "./users.model";
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

  if(!username || !email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

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

  if(!email || !password) {
    return next(createHttpError(400, "Email and password are required"));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
       next(createHttpError(401, "Invalid email or password"));
       return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
       next(createHttpError(401, "Invalid email or password"));
       return
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      Jwt_Secret as string,
      { expiresIn: "1h" }
    );

    res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: true, 
      sameSite: "lax", 
      maxAge: 60 * 60 * 1000,
    })
    .status(200)
    .json({ message: "Login successful" });
  
  } catch (error: unknown) {
    if (error instanceof Error) {
      return next(createHttpError(500, "Server error"));
     
    }
    return next(createHttpError(500, "Server error"));
    
   
  }
};



export const ContactUs = async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
  const { name, email, message } = req.body;
  if (!name || !email  || !message) {
    return next(createHttpError(400, "All fields are required"));
  }
  try{

    const existsingEmail = await Contact.findOne({ email });
    if (existsingEmail) {
      return next(createHttpError(400, "Email already exists we will contact you soon"));
    }
   
    const contact = new Contact({
      name,
      email,
      message,
    });
    await contact.save();
    res.status(201).json({ message: "Contact created successfully" });

  }catch(error: unknown){ 
    if (error instanceof Error) {
      return next(createHttpError(500, "Server error"));
    }
    return next(createHttpError(500, "Server error"));
  }
   res.status(200).json({ message: "Contact created successfully" });
   return
}
