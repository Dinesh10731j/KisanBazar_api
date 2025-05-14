import { Request, Response, NextFunction } from "express";
import Order from "../order/order.model";
import { User } from "../auth/auth.model";
import Product from "../farmer/farmer.model";
import createHttpError from "http-errors";
import { IOrder } from "../utils/types";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
export const adminDashBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const totalFarmers = await User.countDocuments({ role: "user" });
    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });
    const totalRevenue = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "user" });

    const firstOrder = await Order.findOne().sort({ createdAt: 1 });

    if (!firstOrder) {
      res.status(200).json({
        totalFarmers,
        totalOrders,
        deliveredOrders,
        revenue: 0,
        totalCustomers,
        totalProducts,
        ordersOverTime: [],
      });
    }

    const startDate = firstOrder
      ? new Date(firstOrder.get("createdAt"))
      : new Date();
    const ordersOverTime = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);

      const start = new Date(
        day.toISOString().split("T")[0] + "T00:00:00.000Z"
      );
      const end = new Date(day.toISOString().split("T")[0] + "T23:59:59.999Z");

      const orders = await Order.find({
        createdAt: {
          $gte: start,
          $lte: end,
        },
      })
        .select(
          "_id customerName productIds farmerIds products amount paymentMethod paymentStatus createdAt"
        )
        .lean();

      ordersOverTime.push({
        date: day.toISOString().split("T")[0],
        orders,
      });
    }

    res.status(200).json({
      totalFarmers,
      totalOrders,
      deliveredOrders,
      revenue: totalRevenue[0]?.total || 0,
      totalCustomers,
      totalProducts,
      ordersOverTime,
    });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Internal server error"));
  }
};

export const overView = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const totalOrders = await Order.countDocuments();

    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(endOfLastWeek.getDate() + 6);

    const thisWeekOrders = await Order.countDocuments({
      createdAt: { $gte: startOfThisWeek, $lte: now },
    });

    const lastWeekOrders = await Order.countDocuments({
      createdAt: { $gte: startOfLastWeek, $lte: endOfLastWeek },
    });

    const percentChange =
      lastWeekOrders === 0
        ? 100
        : ((thisWeekOrders - lastWeekOrders) / lastWeekOrders) * 100;

    const firstOrder = await Order.findOne()
      .sort({ createdAt: 1 })
      .select("createdAt");

    if (!firstOrder) {
      res.status(200).json({
        totalOrders,
        percentChange: "0%",
        ordersOverTime: [],
      });

      return;
    }

    const startDate = new Date(firstOrder.get("createdAt"));
    const endDate = new Date(); // today

    const ordersOverTime: { date: string; orderCount: number }[] = [];

    // Loop through each day from startDate to endDate
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const day = new Date(d);
      const start = new Date(
        day.toISOString().split("T")[0] + "T00:00:00.000Z"
      );
      const end = new Date(day.toISOString().split("T")[0] + "T23:59:59.999Z");

      const count = await Order.countDocuments({
        createdAt: { $gte: start, $lte: end },
      });

      ordersOverTime.push({
        date: day.toISOString().split("T")[0],
        orderCount: count,
      });
    }

    res.status(200).json({
      totalOrders,
      percentChange: `${percentChange >= 0 ? "+" : ""}${percentChange.toFixed(
        2
      )}%`,
      ordersOverTime,
    });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Internal server error"));
  }
};

export const manageUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find().select("username email role");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Internal server error"));
  }
};

export const changeUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !["admin", "farmer", "user"].includes(role)) {
    res.status(400).json({ message: "Invalid or missing role." });
    return;
  }

  try {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json({
      message: "User role updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id - Delete user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

interface PopulatedProduct {
  username: string;
  _id: mongoose.Types.ObjectId;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}
export const Orders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate("customerId", "username")
      .populate("productIds", "name price imageUrl")
      .populate("farmerIds", "username");

    const formattedOrders = orders.map((order: IOrder) => {
      const buyerName =
        order.customerId &&
        typeof order.customerId === "object" &&
        "username" in order.customerId
          ? order.customerId.username
          : "Unknown Buyer";
      const products = order.products.map((product, index) => {
        const productData = order.productIds[
          index
        ] as unknown as PopulatedProduct;
        const imageUrl = productData?.imageUrl || "";
        const farmer = order.farmerIds[index];
        const farmerName =
          farmer && typeof farmer === "object" && "username" in farmer
            ? farmer.username
            : "Unknown Farmer";

        return {
          productName: product.name,
          amount: product.price * product.quantity,
          imageUrl,
          farmerName,
        };
      });

      return {
        buyerName,
        products,
        totalAmount: order.amount,
        paymentStatus: order.paymentStatus,
      };
    });

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Failed to get order overview:", error);
    next(createHttpError(500, "Internal server error"));
  }
};

export const adminSetting = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { adminName, email, password } = req.body;
  const { userId } = req.params;

  const missingFields = [];
  if (!adminName) missingFields.push("adminName");
  if (!email) missingFields.push("email");
  if (!password) missingFields.push("password");
  if (!userId) missingFields.push("userId");

  if (missingFields.length > 0) {
    return next(
      createHttpError(
        400,
        `Missing required fields: ${missingFields.join(", ")}`
      )
    );
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const updateSetting = await User.findByIdAndUpdate(
      {_id: userId },
      { username: adminName, email, password: hashedPassword }
    );

    if (!updateSetting)
      res.status(404).json({ message: "User not found", success: false });

    res
      .status(200)
      .json({ message: "Profile updated successfully", success: true });
    return;
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Internal server error"));
  }
};
