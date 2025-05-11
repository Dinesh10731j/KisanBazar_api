import { Request, Response, NextFunction } from "express";
import Order from "../payments/order.model";
import { User } from "../users/users.model";
import Product from "../farmer/farmer.model";
import createHttpError from "http-errors";

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

    const startDate = firstOrder ? new Date(firstOrder.get('createdAt')) : new Date();
    const ordersOverTime = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);

      const start = new Date(day.toISOString().split("T")[0] + "T00:00:00.000Z");
      const end = new Date(day.toISOString().split("T")[0] + "T23:59:59.999Z");

      const orders = await Order.find({
        createdAt: {
          $gte: start,
          $lte: end,
        },
      }).select("_id customerName productIds farmerIds products amount paymentMethod paymentStatus createdAt").lean();

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
