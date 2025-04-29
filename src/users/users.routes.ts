// src/routes/userRoutes.ts
import express from 'express';
import { registerUser } from './users.controller';

const UserRouter = express.Router();
UserRouter.post('/register', registerUser);

export default UserRouter
