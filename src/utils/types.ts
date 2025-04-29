import { Document } from "mongoose";
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user' | 'farmer'; 
    createdAt: Date;
    updatedAt: Date;
  }