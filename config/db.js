import mongoose from "mongoose";

export const connectDB = async() => {
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