import { Router } from "express";
import {
  addProducts,
  getProducts,
  deleteProduct,
  updateProduct,
  updateProfile,
  getAllProducts,
  salesOverView,
  getFarmerDashboard,
} from "./farmer.controller";
import upload from "../middleware/multer";
import { productValidator, profileValidator } from "../validator/validator";
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

farmerRouter.get("/get-products", authenticateUser, getProducts);

farmerRouter.delete(
  "/delete-product/:productId",
  authenticateUser,
  deleteProduct
);
farmerRouter.put("/update-product/:productId", authenticateUser, updateProduct);

farmerRouter.put(
  "/update-profile",
  authenticateUser,
  profileValidator,
  validate,
  updateProfile
);

farmerRouter.get("/products", authenticateUser, getAllProducts);
farmerRouter.get("/sales-overview", authenticateUser, salesOverView);
farmerRouter.get("/dashboard", authenticateUser, getFarmerDashboard);

export default farmerRouter;
