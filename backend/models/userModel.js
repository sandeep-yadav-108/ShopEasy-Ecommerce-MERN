import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['consumer', 'merchant'], 
      default: 'consumer' 
    },
  },
  { timestamps: true }
);
const User=mongoose.model("User",userSchema)
export default User
