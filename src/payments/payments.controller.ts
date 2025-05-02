import { NextFunction, Request, Response } from 'express';
import Order from './order.model';
import { generateEsewaPayload } from './services/e-sewa.service';
import { verifyKhaltiPayment } from './services/khalti.service';
import createHttpError from 'http-errors';

export const createOrderAndInitiate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customerName, products, paymentMethod, amount, productIds } = req.body;

    if (!customerName || !products || !paymentMethod || !amount || !productIds) {
      return next(createHttpError(400, 'Missing required order fields.'));
    }

    const order = await Order.create({
      customerName,
      productIds,
      products,
      amount,
      paymentMethod,
    });

    if (paymentMethod === 'eSewa') {
      const payload = generateEsewaPayload({ amount, orderId: order._id.toString() });
      res.json({
        paymentUrl: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
        payload,
      });
      return;
    }
const token = 12345;
    if (paymentMethod === 'Khalti') {
     const payload =  await verifyKhaltiPayment(amount,token);
      res.json({
        paymentUrl: 'https://test.khalti.com/checkout', 
        orderId: order._id,
        payload,
      });
      return;
    }

    if (paymentMethod === 'onCash') {
      await Order.findByIdAndUpdate(order._id, { paymentStatus: 'Success' });
      res.json({
        message: 'Cash on Delivery order placed successfully.',
        orderId: order._id,
      });
      return;
    }

    return next(createHttpError(400, 'Invalid payment method'));
  } catch (error) {
    return next(error);
  }
};
