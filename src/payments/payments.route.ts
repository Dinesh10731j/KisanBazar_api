import { Router } from "express";
import { createOrderAndInitiate } from "./payments.controller";

const paymentRouter = Router();

paymentRouter.post("/initiate", createOrderAndInitiate);

export default paymentRouter;
