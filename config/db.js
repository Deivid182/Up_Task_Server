import mongoose from "mongoose";
import dotenv from "dotenv";

export const connectDB = async() => {

  dotenv.config();
  try {
    await mongoose.connect(
      process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )

    console.log("DB ready")  

  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}