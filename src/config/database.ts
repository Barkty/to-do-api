import mongoose from "mongoose";
import dotenv from "dotenv";
import Env from "../shared/utils/envholder/env";

dotenv.config();

mongoose.set('strictQuery', false);

const DATABASE_URL = Env.get<string>('DATABASE_URL') 
const DATABASE_NAME = Env.get<string>('DATABASE_NAME') 

/**
 * Connect to database
 */
export const connect = async (uri: string, dbName: string) => {
    try {
        if (mongoose.connection.readyState === 0) {
            mongoose.connect(uri, {
                dbName
            });
            console.log("Connected to database");
        }
        
    } catch (error) {
        console.log('DB connect: ', error)
    }
};

/**
 * Connect to other databases depending on environment
 */
export const connectDB = async (dbName = DATABASE_NAME) => {
    await connect(DATABASE_URL, dbName);
};
