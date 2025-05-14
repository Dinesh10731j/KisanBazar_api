import { NextFunction, Request, Response } from 'express';
import Order from '../order/order.model';
import { handleCashPayment,handleEsewaPayment,handleKhaltiPayment } from '../payments/payments.controller';
import createHttpError from 'http-errors';

export const createOrderAndInitiate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customerId, products, paymentMethod, amount, productIds, farmerIds } = req.body;

    if (!customerId || !products || !paymentMethod || !amount || !productIds) {
      return next(createHttpError(400, 'Missing required order fields.'));
    }

    const order = await Order.create({
      customerId,
      productIds,
      farmerIds,
      products,
      amount,
      paymentMethod,
    }) as { _id: string };

    switch (paymentMethod) {
      case 'eSewa':
        await handleEsewaPayment(order._id.toString(), amount, res);
        return;
      case 'Khalti': {
        const token = 12345; // Replace this with real token from frontend
        await handleKhaltiPayment(order._id.toString(), amount, token, res);
        return;
      }
      case 'onCash':
        await handleCashPayment(order._id.toString(), res);
        return;
      default:
        return next(createHttpError(400, 'Invalid payment method'));
    }
  } catch (error) {
    return next(error);
  }
};
