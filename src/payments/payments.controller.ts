import { Response } from 'express';
import Order from '../order/order.model';
import { generateEsewaPayload } from './services/e-sewa.service';
import { verifyKhaltiPayment } from './services/khalti.service';

export const handleEsewaPayment = async (
  orderId: string,
  amount: number,
  res: Response
): Promise<void> => {
  const payload = generateEsewaPayload({ amount, orderId });
  res.json({
    paymentUrl: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
    payload,
  });
};

export const handleKhaltiPayment = async (
  orderId: string,
  amount: string,
  token: number,
  res: Response
): Promise<void> => {
  const payload = await verifyKhaltiPayment(amount, token);
  res.json({
    paymentUrl: 'https://test.khalti.com/checkout',
    orderId,
    payload,
  });
};

export const handleCashPayment = async (
  orderId: string,
  res: Response
): Promise<void> => {
  await Order.findByIdAndUpdate(orderId, { paymentStatus: 'Success' });
  res.json({
    message: 'Cash on Delivery order placed successfully.',
    orderId,
  });
};
