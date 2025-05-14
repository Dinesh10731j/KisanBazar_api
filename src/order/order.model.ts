import mongoose from "mongoose";
import { IOrder } from "../utils/types";


const orderSchema = new mongoose.Schema<IOrder>(
  {
    customerId: {
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:"User",
    },
   productIds: [
      { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
    ],
    farmerIds: [
      { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    ],

    products: [{ name: String, price: Number, quantity: Number }],
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["eSewa", "Khalti", "onCash"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
    orderId: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
