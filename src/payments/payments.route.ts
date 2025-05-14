import { Router } from "express";
import { createOrderAndInitiate } from "../order/order.controller";

const paymentRouter = Router();

paymentRouter.post("/initiate", createOrderAndInitiate);

export default paymentRouter;
