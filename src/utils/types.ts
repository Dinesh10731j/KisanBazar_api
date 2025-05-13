import { Document } from "mongoose";
import { Types } from "mongoose";
export interface IUser extends Document {
  username:string,
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

 
  export interface IProductInfo {
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  customerId:Types.ObjectId | {_id:string,username:string}; // populated
  productIds: string[];
  farmerIds: (Types.ObjectId | { _id: string; imageUrl: string; farmerName: string })[];
  products: IProductInfo[];
  amount: number;
  paymentMethod: 'eSewa' | 'Khalti' | 'onCash';
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
    status:'Success' | 'Pending',
    createdAt: Date;
    updatedAt: Date;
  }

  export interface AuthRequest extends Request {
    userId: string;
   
  }
  