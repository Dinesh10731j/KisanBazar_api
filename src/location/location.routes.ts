import { Router } from 'express';
import {
  createLocation,
  updateLocation,
  getLocation,
  markAsDelivered,
} from './location.controller';
import {
  createLocationValidator,
  updateLocationValidator,
  getLocationValidator,
  markAsDeliveredValidator,
} from '../validator/validator';
import validate from '../middleware/validate';

const locationRouter = Router();

locationRouter.post('/createLocation', createLocationValidator, validate, createLocation);
locationRouter.patch('/updateLocation', updateLocationValidator, validate, updateLocation);
locationRouter.get('/:orderId', getLocationValidator, validate, getLocation);
locationRouter.patch('/:orderId/delivered', markAsDeliveredValidator, validate, markAsDelivered);

export default locationRouter;
