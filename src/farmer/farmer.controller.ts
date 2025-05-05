import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import Product from "./farmer.model";
import cloudinary from "../config/cloudinary";
import path from "path";
import fs from "fs";
import { AuthRequest } from "../utils/types";
export const addProducts = async (
  req: Request & { file?: Express.Multer.File },
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, price, quantity, description } = req.body;

  if (!name || !price || !quantity || !description) {
    return next(createHttpError(400, "All fields are required"));
  }

  if (!req.file) {
    return next(createHttpError(400, "Image file is required"));
  }

  const filePath = path.resolve(__dirname, "../../uploads", req.file.filename);

  try {
    const _req = req as unknown as AuthRequest;
    if(!_req.userId){
        return next(createHttpError(400, "Instructor id is missing"));
      }
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "kisan_bazar",
      public_id: req.file.filename.split(".")[0],
    });

    fs.unlinkSync(filePath);

    const product = new Product({
      name,
      price,
      quantity,
      description,
      imageUrl: uploadResult.secure_url,
      farmerId: _req.userId,
    });

    await product.save();

    res.status(201).json({ message: "Product added successfully"});
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); 
    }

    console.error("Upload error:", error);
    return next(createHttpError(500, "Image upload or product creation failed"));
  }
};
