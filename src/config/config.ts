import {config} from "dotenv";
config();
const Configuration = {
    PORT: process.env.PORT ?? 1080,
    Mongo_Url :process.env.MONGO_URL,
    env:process.env.NODE_ENV,
    Jwt_Secret:process.env.JWT_SECRET,
    Cloudinary_Name:process.env.CLOUDINARY_NAME,
    Cloudinary_Api_Key:process.env.CLOUDINARY_API_KEY,
    Cloudinary_Api_Secret:process.env.CLOUDINARY_API_SECRET,
    Khalti_Public_Key:process.env.KHALTI_SECRET_KEY,
  };
  
  Object.freeze(Configuration);
  
  export default Configuration;