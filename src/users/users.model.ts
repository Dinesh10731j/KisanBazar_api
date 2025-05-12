
import mongoose, { Schema } from 'mongoose';
import { IUser,IContact } from '../utils/types';


// Define the User schema
const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['admin', 'user','farmer'],
      default: 'user',
    },
  },
  { timestamps: true }
);


const conatctSchema: Schema = new Schema<IContact>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    minlength: 10,
    required: true,
  },
})

const User = mongoose.model<IUser>('User', userSchema);
const Contact = mongoose.model<IContact>('Contact', conatctSchema);
export { User, Contact };
