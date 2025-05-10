
import mongoose from 'mongoose';
import { IOrder } from '../utils/types';

const orderSchema = new mongoose.Schema<IOrder>({
  customerName: { type: mongoose.Schema.ObjectId,
     required: true,
     ref: 'User'
   },
  productIds: [{ type: String, required: true }],
  farmerIds:[{type:mongoose.Types.ObjectId,required:true,ref:"Product"}],

  products: [{ name: String, price: Number, quantity: Number }],
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['eSewa', 'Khalti','onCash'], required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
  transactionId: String
}, { timestamps: true });

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
