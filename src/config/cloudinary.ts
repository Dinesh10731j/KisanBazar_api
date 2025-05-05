import {v2 as cloudinary} from "cloudinary";
import Configuration from "./config";
const {Cloudinary_Api_Key,Cloudinary_Api_Secret,Cloudinary_Name} = Configuration
cloudinary.config({
    cloud_name:Cloudinary_Name,
    api_key:Cloudinary_Api_Key,
    api_secret:Cloudinary_Api_Secret
});

export default cloudinary;