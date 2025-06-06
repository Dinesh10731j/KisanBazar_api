import mongoose, { Schema } from 'mongoose';
import { ILocation } from '../utils/types';
const locationSchema: Schema<ILocation> = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userLocation: {
    lat: Number,
    lng: Number
  },
  farmerLocation: {
    lat: Number,
    lng: Number
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const Location = mongoose.model<ILocation>('Location', locationSchema);
