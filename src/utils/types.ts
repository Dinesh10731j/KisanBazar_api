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


  export interface IProduct extends Document {
    name: string;
    price: string;
    quantity: string;
    description: string;
    category: string;
    imageUrl: string;
    farmerId: Types.ObjectId; 
    createdAt: Date;
    updatedAt: Date;
  }

  export interface AuthRequest extends Request {
    userId: string;
   
  }
  