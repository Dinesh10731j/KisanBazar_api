import {Schema,model} from "mongoose";
import { IProduct } from "../utils/types";

const Products = new Schema<IProduct>({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl:{
        type:String,
        required:true
    },
    farmerId:{
        type: Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true });


const Product = model<IProduct>("Product", Products);
export default Product;