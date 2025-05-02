import { Document } from "mongoose";
import { Types } from "mongoose";
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user' | 'farmer'; 
    createdAt: Date;
    updatedAt: Date;
  }


  export interface IContact extends Document {
    name: string;
    email: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
  }

 
  export interface IOrder extends Document {
    _id: Types.ObjectId;
    customerName:Types.ObjectId; 
    productIds: string[]; 
    products: { name: string; price: number; quantity: number }[]; 
    amount: number;
    paymentMethod: 'eSewa' | 'Khalti';
    paymentStatus: 'Pending' | 'Success' | 'Failed'; 
    transactionId?: string;
  }