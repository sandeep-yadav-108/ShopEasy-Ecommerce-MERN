import mongoose from "mongoose";


const connectMongoDb = async() => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    if(mongoose.connection.readyState==1)console.log("Mongoose Connected")
  } catch (error) {
    console.error(" MongoDB Connection Error:", error);
    
  }
};

export default connectMongoDb;
