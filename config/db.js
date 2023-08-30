import mongoose from 'mongoose';
import dotenv from 'dotenv';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('DB ready');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
