import mongoose from 'mongoose';
import Configuration from './config';
const {Mongo_Url} = Configuration
mongoose.connection.on('connected', () => console.log('Mongoose connected'));
mongoose.connection.on('open', () => console.log('Mongoose connection open'));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));
mongoose.connection.on('reconnected', () => console.log('Mongoose reconnected'));
mongoose.connection.on('disconnecting', () => console.log('Mongoose disconnecting'));
mongoose.connection.on('close', () => console.log('Mongoose connection closed'));

const connectDB = async ():Promise<void> => {
  try {
    await mongoose.connect(Mongo_Url as string);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error:unknown ) {
    if(error instanceof Error){
        console.error(`Error connecting to MongoDB: ${error.message}`);
    }else{
        console.log("An unknown error occured connecting MongoDB");
    }
    process.exit(1);
  }
};

export default connectDB;