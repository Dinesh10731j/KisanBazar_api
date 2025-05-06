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
    if (!_req.userId) {
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

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.error("Upload error:", error);
    return next(
      createHttpError(500, "Image upload or product creation failed")
    );
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const _req = req as unknown as AuthRequest;
    if (!_req.userId) {
      return next(createHttpError(400, "Instructor id is missing"));
    }
    const products = await Product.find({ farmerId: _req.userId });
    if (!products) {
      return next(createHttpError(404, "No products found"));
    }
    if (products.length === 0) {
      return next(createHttpError(404, "No products found"));
    }
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return next(createHttpError(500, "Failed to fetch products"));
  }
};


export const deleteProduct = async (
  req: Request,
  res:Response,
  next:NextFunction
):Promise<void> => {
  const { productId } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return next(createHttpError(404, "Product not found"));
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return next(createHttpError(500, "Failed to delete product"));
  }
}

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { productId } = req.params;
  const { name, price, quantity, description } = req.body;

  if (!name || !price || !quantity || !description) {
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, price, quantity, description },
      { new: true }
    );

    if (!updatedProduct) {
      return next(createHttpError(404, "Product not found"));
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    return next(createHttpError(500, "Failed to update product"));
  }
}
