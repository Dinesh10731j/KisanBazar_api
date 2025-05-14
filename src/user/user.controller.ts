import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import Order from "../order/order.model";

export const getUserDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    if (!userId) return next(createHttpError(400, "User ID is required"));

    const orders = await Order.find({ customerId: userId });

    const totalOrders = orders.length;

    const totalSpent = orders.reduce((acc, order) => acc + (order.amount || 0), 0);

    const lastOrderDate =
      orders.length > 0
        ? new Date(
            Math.max(...orders.map((order) => new Date(order.get("createdAt")).getTime()))
          )
        : null;

    // Correct quantity-based count for products
    const productCategoryCount: Record<string, number> = {};
    orders.forEach((order) => {
      order.products?.forEach((product) => {
        const name = product.name;
        const quantity = product.quantity || 1;
        productCategoryCount[name] = (productCategoryCount[name] || 0) + quantity;
      });
    });

    // Count orders grouped by month and year
    const orderMonthlyCount: Record<string, number> = {};
    orders.forEach((order) => {
      const date = new Date(order.get("createdAt"));
      const monthYear = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      }); // e.g., "Apr 2025"
      orderMonthlyCount[monthYear] = (orderMonthlyCount[monthYear] || 0) + 1;
    });

    res.json({
      totalOrders,
      totalSpent,
      lastOrderDate,
      productCategoryCount,
      orderMonthlyCount,
    });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Internal server error"));
  }
};
