import mongoose from "mongoose";

export const connectDB = async () => {
    // Database connection logic will go here in the future
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected successfully");
    }
    catch(err){
        console.log("Error connecting to database:", err);
        process.exit(1);
    }
};
