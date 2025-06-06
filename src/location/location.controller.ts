import { Request, Response } from 'express';
import { Location } from './location.model';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import { UpdateLocationBody } from '../utils/types';

const isErrorWithMessage = (error: unknown): error is { message: string } => {
  return typeof error === 'object' && error !== null && 'message' in error;
};

export const createLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (err: unknown) {
    const message = isErrorWithMessage(err) ? err.message : 'Internal Server Error';
    res.status(500).json({ error: message });
  }
};

export const updateLocation = async (req: Request<object, object, UpdateLocationBody>, res: Response): Promise<void> => {
  try {
    const { orderId, role, location } = req.body;

    const existing = await Location.findOne({ orderId });
    if (!existing) throw createHttpError(404, 'Location not found');

    if (role === 'user') {
      existing.userLocation = location;
    } else {
      existing.farmerLocation = location;
    }

    existing.updatedAt = new Date();
    await existing.save();

    res.status(200).json(existing);
  } catch (err: unknown) {
    const message = isErrorWithMessage(err) ? err.message : 'Internal Server Error';
    res.status(500).json({ error: message });
  }
};

export const getLocation = async (req: Request<{ orderId: string }>, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw createHttpError(400, 'Invalid Order ID');
    }

    const location = await Location.findOne({ orderId });
    if (!location) throw createHttpError(404, 'Location not found');

    res.status(200).json(location);
  } catch (err: unknown) {
    const message = isErrorWithMessage(err) ? err.message : 'Internal Server Error';
    res.status(500).json({ error: message });
  }
};

export const markAsDelivered = async (req: Request<{ orderId: string }>, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw createHttpError(400, 'Invalid Order ID');
    }

    const location = await Location.findOneAndUpdate(
      { orderId },
      { isDelivered: true },
      { new: true }
    );

    if (!location) throw createHttpError(404, 'Location not found');

    res.status(200).json(location);
  } catch (err: unknown) {
    const message = isErrorWithMessage(err) ? err.message : 'Internal Server Error';
    res.status(500).json({ error: message });
  }
};
