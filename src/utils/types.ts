import { Document,Types} from "mongoose";

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
  orderId?: string;
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
  

  export interface ILocation extends Document {
    orderId: Types.ObjectId;
    userId: Types.ObjectId;
    farmerId: Types.ObjectId;
    userLocation?: {
      lat: number;
      lng: number;
    };
    farmerLocation?: {
      lat: number;
      lng: number;
    };
    isDelivered: boolean;
    updatedAt: Date;
  }


  //Update Location Body Interface
  
  export interface UpdateLocationBody {
    orderId: string;
    role: 'user' | 'farmer';
    location: {
      lat: number;
      lng: number;
    };
  }