import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import Product from "./farmer.model";
import cloudinary from "../config/cloudinary";
import path from "path";
import fs from "fs";
import { AuthRequest } from "../utils/types";
import { User } from "../users/users.model";
import bcrypt from "bcryptjs";
import Order from "../payments/order.model";
import mongoose from "mongoose";
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
      status: "Success",
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
  res: Response,
  next: NextFunction
): Promise<void> => {
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
};

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
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, email, password } = req.body;
  const _req = req as unknown as AuthRequest;
  const userId = _req.userId;
  if (!userId) {
    return next(createHttpError(400, "User id is missing"));
  }
  if (!username || !email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const updatedFarmer = await User.findByIdAndUpdate(
      userId,
      { username, email, password: hashedPassword },
      { new: true }
    );

    if (!updatedFarmer) {
      return next(createHttpError(404, "Farmer not found"));
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return next(createHttpError(500, "Failed to update profile"));
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await Product.find({});
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

export const salesOverView = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sales = await Product.aggregate([
      {
        $addFields: {
          numericPrice: {
            $convert: {
              input: {
                $replaceAll: { input: "$price", find: "kg", replacement: "" },
              },
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
          numericQuantity: {
            $convert: {
              input: {
                $replaceAll: {
                  input: "$quantity",
                  find: "kg",
                  replacement: "",
                },
              },
              to: "int",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "farmerId",
          foreignField: "_id",
          as: "farmer",
        },
      },
      {
        $unwind: "$farmer",
      },
      {
        $project: {
          farmerName: "$farmer.username",
          productName: "$name",
          totalPrice: "$numericPrice",
          totalQuantity: "$numericQuantity",
          date: "$createdAt",
        },
      },
    ]);

    res.status(200).json(sales);
  } catch (error) {
    console.error("Error generating sales overview:", error);
    return next(createHttpError(500, "Failed to generate sales overview"));
  }
};

export const getFarmerDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const _req = req as unknown as AuthRequest;
  const farmerId = _req.userId;

  if (!farmerId) {
    return next(createHttpError(400, "Farmer ID is missing"));
  }

  const farmerObjectId = new mongoose.Types.ObjectId(farmerId);

  try {
    const totalProducts = await Product.countDocuments({
      farmerId: farmerObjectId,
    });

    const orders = await Order.find({
      farmerIds: farmerObjectId,
      paymentStatus: "Success",
    });

    // Sum up total sales
    const totalSales = orders.reduce((acc, order) => acc + order.amount, 0);

    // Count pending orders
    const pendingOrders = await Order.countDocuments({
      farmerIds: farmerObjectId,
      paymentStatus: "Pending",
    });

    // Sales overview aggregation by day
    const salesOverviewRaw = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Success",
          farmerIds: { $in: [farmerObjectId] },
        },
      },
      {
        $project: {
          dayOfWeek: { $dayOfWeek: { $toDate: "$createdAt" } },
          amount: 1,
        },
      },
      {
        $group: {
          _id: "$dayOfWeek",
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          day: {
            $let: {
              vars: {
                days: ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              },
              in: { $arrayElemAt: ["$$days", "$_id"] },
            },
          },
          total: 1,
        },
      },
      { $sort: { _id: 1 } },
    ]);

    if (salesOverviewRaw.length === 0) {
      return next(createHttpError(404, "Sales OverView not found"));
    }

    const salesOverview = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
      (day) => {
        const dayData = salesOverviewRaw.find((item) => item.day === day);
        return {
          day,
          total: dayData ? dayData.total : 0,
        };
      }
    );

    const products = await Product.find({ farmerId: farmerObjectId })
      .select("name price quantity status imageUrl")
      .lean();

    res.status(200).json({
      totalProducts,
      totalSales,
      pendingOrders,
      salesOverview,
      products,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return next(createHttpError(500, "Failed to fetch dashboard data"));
  }
};
