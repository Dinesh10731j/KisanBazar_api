import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import Configuration from "../config/config";
const { Jwt_Secret } = Configuration;
import { AuthRequest } from "../utils/types";
export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized", success: false });
      return;
    }

    if (!token) {
       res.status(401).json({ message: "Unauthorized", success: false });
       return;
    }
    const decoded = jwt.verify(token as string, Jwt_Secret as string) as JwtPayload;
    const _req = req as unknown as AuthRequest;
    _req.userId = decoded.userId as string;
    next();
  } catch (error: unknown) {


    if (error instanceof jwt.JsonWebTokenError) {
       next(createHttpError(401, "Invalid or expired token"));
       return;
       
    }

    if (error instanceof jwt.TokenExpiredError) {
       next(createHttpError(401, "Token has expired"));
       return;
    }

    if (error instanceof Error) {
       next(createHttpError(500, error.message));
       return;
    }

     next(createHttpError(500, "An unexpected error occurred"));
     return;
  }
};