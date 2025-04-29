import Configuration from "../config/config";
import { HttpError } from "http-errors";
import { Request, Response, NextFunction } from "express";

const {env} = Configuration;

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  void next;

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
    errorStack: env === "development" ? err.stack : "",
  });
};

export default globalErrorHandler;