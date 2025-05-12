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

 
    const firstOrder = await Order.findOne().sort({ createdAt: 1 }).select("createdAt");

    if (!firstOrder) {
     res.status(200).json({
        totalOrders,
        percentChange: "0%",
        ordersOverTime: [],
      });

      return;
    }

    const startDate = new Date(firstOrder.get('createdAt'));
    const endDate = new Date(); // today

    const ordersOverTime: { date: string; orderCount: number }[] = [];

    // Loop through each day from startDate to endDate
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const day = new Date(d);
      const start = new Date(day.toISOString().split("T")[0] + "T00:00:00.000Z");
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
      percentChange: `${percentChange >= 0 ? "+" : ""}${percentChange.toFixed(2)}%`,
      ordersOverTime,
    });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Internal server error"));
  }
};
