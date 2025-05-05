import { Router } from "express";
import { addProducts } from "./farmer.controller";
import upload from "../middleware/multer";
import { productValidator } from "../validator/validator";
import validate from "../middleware/validate";
import { authenticateUser } from "../middleware/authMiddleware";
const farmerRouter = Router();
farmerRouter.post(
  "/add-products",
  upload.single("image"),
  authenticateUser,
  productValidator,
  validate,
  addProducts
);

export default farmerRouter;
